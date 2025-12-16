const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) return res.redirect("/auth/login");
  next();
}

// Home: phân loại + phân trang + slide
router.get("/", async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1"), 1);
  const limit = 8;
  const skip = (page - 1) * limit;

  const category = (req.query.category || "").trim();
  const filter = {};
  if (category) filter.category = category;

  const [products, total, categories] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
    Product.distinct("category"),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.render("home", {
    title: "Home",
    products,
    categories: categories.filter(Boolean),
    category,

    page,
    totalPages,
    hasPrev: page > 1,
    hasNext: page < totalPages,
    prevPage: page - 1,
    nextPage: page + 1,

    slides: [
  {
    img: "https://image.tinnhanhchungkhoan.vn/w660/Uploaded/2025/wpxlcdjwi/2024_12_24/iphone-17-air-thiet-ke-sieu-mong-gia-phai-chang-hon-dong-pro1735011282-5198.jpg",
    title: "Build • Ship • Improve",
    desc: "Midterm project — clean structure",
  },
  {
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600",
    title: "Search & Filter",
    desc: "Tìm nhanh, lọc chuẩn, phân trang gọn",
  },
  {
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600",
    title: "Admin Dashboard",
    desc: "CRUD products + sort tăng dần",
  },
],


  });
});


router.get("/contact", requireAuth, (req, res) => {
  res.render("contact", { title: "Contact" });
});

module.exports = router;
