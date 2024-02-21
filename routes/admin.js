const express = require("express");
const path = require("path");

const root = require("../util/path");
const router = express.Router();

const products = [];
router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(root, "views", "add-product.html"));
  //   next();
});

router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});

exports.routes = router;
exports.products = products;
