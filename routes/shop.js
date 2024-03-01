const express = require("express");
const path = require("path");
const root = require("../util/path");
const adminData = require("./admin");

const shopController = require("../controller/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productid", shopController.getProduct);

router.get("/cart", shopController.getCart);
router.post("/cart", shopController.postCart);
router.post("/cart-delete-item", shopController.postCartDeleteProduct);
// router.post("/create-order",shopController.postOrder);
// router.get("/checkout", shopController.getCheckOut);
// router.get("/orders", shopController.getOrders);

module.exports = router;
