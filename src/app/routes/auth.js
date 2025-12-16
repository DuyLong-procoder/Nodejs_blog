const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.get("/register", (req, res) => {
  res.render("auth/register", { title: "Register" });
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email }).lean();
  if (exists) {
    return res.render("auth/register", { title: "Register", error: "Email đã tồn tại." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ name, email, passwordHash });
  res.redirect("/auth/login");
});

router.get("/login", (req, res) => {
  res.render("auth/login", { title: "Login" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.render("auth/login", { title: "Login", error: "Sai email hoặc mật khẩu." });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.render("auth/login", { title: "Login", error: "Sai email hoặc mật khẩu." });

  req.session.user = { id: user._id.toString(), name: user.name, email: user.email };
  res.redirect("/");
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;
