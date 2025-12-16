const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET /categories
router.get("/", async (req, res) => {
  const categories = await Product.distinct("category");
  const clean = categories.filter((c) => c && String(c).trim());

  // đếm số sản phẩm theo từng category
  const counts = await Product.aggregate([
    { $match: { category: { $in: clean } } },
    { $group: { _id: "$category", total: { $sum: 1 } } },
    { $sort: { total: -1 } },
  ]);

  const mapCount = {};
  counts.forEach((x) => (mapCount[x._id] = x.total));

  const categoryList = clean
    .sort((a, b) => a.localeCompare(b))
    .map((c) => ({ name: c, total: mapCount[c] || 0 }));

  res.render("categories/index", {
    title: "Categories",
    categories: categoryList,
  });
});

// GET /categories/:category  -> list products by category
router.get("/:category", async (req, res) => {
  const category = decodeURIComponent(req.params.category);

  const page = Math.max(parseInt(req.query.page || "1"), 1);
  const limit = 8;
  const skip = (page - 1) * limit;

  const q = (req.query.q || "").trim();
  const min = req.query.min ? Number(req.query.min) : null;
  const max = req.query.max ? Number(req.query.max) : null;

  const filter = { category };
  if (q) filter.name = { $regex: q, $options: "i" };
  if (min !== null || max !== null) {
    filter.price = {};
    if (min !== null) filter.price.$gte = min;
    if (max !== null) filter.price.$lte = max;
  }

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  res.render("categories/show", {
    title: `Category: ${category}`,
    category,
    products,

    q,
    min: req.query.min || "",
    max: req.query.max || "",

    totalItems: total,
    page,
    totalPages,
    pageNumbers,
    hasPrev: page > 1,
    hasNext: page < totalPages,
    prevPage: page - 1,
    nextPage: page + 1,
  });
});

module.exports = router;
