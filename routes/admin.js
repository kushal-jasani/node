const express = require("express");
const path = require("path");
const root = require("../util/path");

const adminController = require("../controller/admin");
const router = express.Router();

router.get("/add-product", adminController.getAddProduct);

router.post("/add-product", adminController.postAddProduct);

router.get("/products", adminController.getProducts);

router.get("/edit-product/:productid",adminController.getEditProduct);
// exports.routes = router;
// exports.products = products;

module.exports = router;
