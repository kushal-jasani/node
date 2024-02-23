const express = require("express");
const path = require("path");
const root = require("../util/path");

const productsController = require("../controller/product");
const router = express.Router();

router.get("/add-product", productsController.getAddProduct);

router.post("/add-product", productsController.postAddProduct);

// exports.routes = router;
// exports.products = products;

module.exports=router; 
