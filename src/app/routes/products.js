const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// /products : list + search + filter + pagination
router.get("/", async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1"), 1);
  const limit = 8;
  const skip = (page - 1) * limit;

  const q = (req.query.q || "").trim();
  const min = req.query.min ? Number(req.query.min) : null;
  const max = req.query.max ? Number(req.query.max) : null;
  const category = (req.query.category || "").trim();

  const filter = {};
  if (q) filter.name = { $regex: q, $options: "i" };
  if (category) filter.category = category;
  if (min !== null || max !== null) {
    filter.price = {};
    if (min !== null) filter.price.$gte = min;
    if (max !== null) filter.price.$lte = max;
  }

  const [products, total, categories] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
    Product.distinct("category"),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.render("products/index", {
    title: "Products",
    products,
    categories: categories.filter(Boolean),
    q,
    min: req.query.min || "",
    max: req.query.max || "",
    category,

    page,
    totalPages,
    hasPrev: page > 1,
    hasNext: page < totalPages,
    prevPage: page - 1,
    nextPage: page + 1,
  });
});

// /products/:slug : detail
router.get("/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).lean();
  if (!product) return res.status(404).render("404", { title: "Not found" });

  res.render("products/show", { title: product.name, product });
});

module.exports = router;
