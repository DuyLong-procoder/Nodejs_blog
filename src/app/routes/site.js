const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 }).limit(8).lean();
  res.render("home", { products, title: "Home" });
});

router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact" });
});

module.exports = router;
