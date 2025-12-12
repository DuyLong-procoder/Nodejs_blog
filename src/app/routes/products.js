const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  res.render("products/index", { products, title: "Products" });
});

router.get("/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).lean();
  if (!product) return res.status(404).send("Not found");
  res.render("products/show", { product, title: product.name });
});

module.exports = router;
