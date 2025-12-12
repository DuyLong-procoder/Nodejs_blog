const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// LIST
router.get("/products", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  res.render("admin/products/index", { products, title: "Admin - Products" });
});

// CREATE form
router.get("/products/create", (req, res) => {
  res.render("admin/products/create", { title: "Create product" });
});

// CREATE submit
router.post("/products", async (req, res) => {
  await Product.create({
    name: req.body.name,
    price: Number(req.body.price),
    stock: Number(req.body.stock || 0),
    image: req.body.image || "",
    description: req.body.description || "",
  });
  res.redirect("/admin/products");
});

// EDIT form
router.get("/products/:id/edit", async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  res.render("admin/products/edit", { product, title: "Edit product" });
});

// UPDATE submit
router.put("/products/:id", async (req, res) => {
  await Product.updateOne(
    { _id: req.params.id },
    {
      name: req.body.name,
      price: Number(req.body.price),
      stock: Number(req.body.stock || 0),
      image: req.body.image || "",
      description: req.body.description || "",
    }
  );
  res.redirect("/admin/products");
});


router.delete("/products/:id", async (req, res) => {
  await Product.deleteOne({ _id: req.params.id });
  res.redirect("/admin/products");
});

module.exports = router;
