const express = require("express");
const path = require("path");
const morgan = require("morgan");
const methodOverride = require("method-override");
const handleBars = require("express-handlebars");
const session = require("express-session");

const siteRoutes = require("./app/routes/site");
const productRoutes = require("./app/routes/products");
const adminRoutes = require("./app/routes/admin");
const authRoutes = require("./app/routes/auth");
const categoryRoutes = require("./app/routes/categories");

const app = express();

// middlewares
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "../public"))); // chú ý path

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "duylongshop_secret",
    resave: false,
    saveUninitialized: false,
  })
);

// expose user
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// view engine
app.engine(
  "hbs",
  handleBars.engine({
    extname: ".hbs",
    helpers: {
      ifEquals(a, b, options) {
        return String(a) === String(b) ? options.fn(this) : options.inverse(this);
      },
      firstChar(name) {
        if (!name) return "";
        return String(name).trim().charAt(0).toUpperCase();
      },
      or(...args) {
        const values = args.slice(0, -1);
        return values.some((v) => !!v);
      },
      range(from, to, options) {
        let out = "";
        const start = Number(from) || 1;
        const end = Number(to) || 1;
        for (let i = start; i <= end; i++) out += options.fn(i);
        return out;
      },
      json(context) {
        return JSON.stringify(context, null, 2);
      },
    },
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../resources/views"));

// routes
app.use("/", siteRoutes);
app.use("/products", productRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);

module.exports = app;
