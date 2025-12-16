const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.user) return res.redirect("/auth/login");
  next();
}

router.get("/products", requireAdmin, async (req, res) => {
  const sort = req.query.sort || "price_asc";
  const sortObj =
    sort === "name_asc" ? { name: 1 } :
    sort === "name_desc" ? { name: -1 } :
    sort === "price_desc" ? { price: -1 } :
    { price: 1 };

  const products = await Product.find().sort(sortObj).lean();
  res.render("admin/products/index", { products, sort, title: "Admin - Products" });
});

router.get("/products/create", requireAdmin, (req, res) => {
  res.render("admin/products/create", { title: "Create product" });
});
const { upload, uploadToCloudinary } = require("../../middlewares/upload");


router.post("/products", upload.single("imageFile"), async (req, res, next) => {
  try {
    // Nếu chọn URL
    let imageUrl = req.body.image || "";

    // Nếu chọn upload file
    if (req.body.imageType === "file" && req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    // TODO: lưu imageUrl vào DB (field image)
    // req.body.image = imageUrl; (tuỳ bạn)
    // ... create product

    res.redirect("/admin/products");
  } catch (err) {
    next(err);
  }
});



router.post("/products", requireAdmin, async (req, res) => {
  await Product.create({
    name: req.body.name,
    category: req.body.category || "Other",
    price: Number(req.body.price),
    stock: Number(req.body.stock || 0),
    image: req.body.image || "",
    description: req.body.description || "",
  });
  res.redirect("/admin/products");
});

router.get("/products/:id/edit", requireAdmin, async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  res.render("admin/products/edit", { product, title: "Edit product" });
});

router.put("/products/:id", requireAdmin, async (req, res) => {
  await Product.updateOne(
    { _id: req.params.id },
    {
      name: req.body.name,
      category: req.body.category || "Other",
      price: Number(req.body.price),
      stock: Number(req.body.stock || 0),
      image: req.body.image || "",
      description: req.body.description || "",
    }
  );
  res.redirect("/admin/products");
});

router.delete("/products/:id", requireAdmin, async (req, res) => {
  await Product.deleteOne({ _id: req.params.id });
  res.redirect("/admin/products");
});

module.exports = router;
