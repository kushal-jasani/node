const express = require("express");
const path = require("path");
const root = require("../util/path");

const adminController = require("../controller/admin");
const router = express.Router();

router.get("/add-product", adminController.getAddProduct);

router.post("/add-product", adminController.postAddProduct);

router.get("/products", adminController.getProducts);
router.get("/edit-product/:productid", adminController.getEditProduct);
router.post("/edit-product", adminController.postEditProduct);

router.post("/delete-product",adminController.postDeleteProduct);

module.exports = router;
