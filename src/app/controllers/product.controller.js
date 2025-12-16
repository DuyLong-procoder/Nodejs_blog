const Product = require("../models/Product");

exports.index = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  res.render("admin/products/index", { products, title: "Admin - Products" });
};

exports.createForm = (req, res) => {
  res.render("admin/products/create", { title: "Create product" });
};

exports.store = async (req, res) => {
  await Product.create({
    name: req.body.name,
    price: Number(req.body.price),
    stock: Number(req.body.stock || 0),
    image: req.body.image || "",
    description: req.body.description || "",
  });
  res.redirect("/admin/products");
};

exports.editForm = async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  res.render("admin/products/edit", { product, title: "Edit product" });
};

exports.update = async (req, res) => {
  await Product.updateOne({ _id: req.params.id }, req.body);
  res.redirect("/admin/products");
};

exports.destroy = async (req, res) => {
  await Product.deleteOne({ _id: req.params.id });
  res.redirect("/admin/products");
};
