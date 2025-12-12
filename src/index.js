const express = require("express");
const path = require("path");
const morgan = require("morgan");
const methodOverride = require("method-override");
const handleBars = require("express-handlebars");
const db = require("./config/db");

const siteRoutes = require("./app/routes/site");
const productRoutes = require("./app/routes/products");
const adminRoutes = require("./app/routes/admin");

const app = express();
const port = 3000;

// middlewares
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// view engine
app.engine("hbs", handleBars.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));

// routes
app.use("/", siteRoutes);
app.use("/products", productRoutes);
app.use("/admin", adminRoutes);

// start
db.connect()
  .then(() => {
    app.listen(port, () => console.log(`App listening on port ${port}`));
  })
  .catch((err) => {
    console.error("DB connect error:", err);
  });
