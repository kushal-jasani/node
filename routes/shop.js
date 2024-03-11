const express = require("express");
const path = require("path");
const root = require("../util/path");
const adminData = require("./admin");

const shopController = require("../controller/shop");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productid", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);
router.post("/cart", isAuth, shopController.postCart);
router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);
router.get("/checkout", isAuth, shopController.getCheckOut);
router.get("/checkout/success", isAuth, shopController.getCheckOutSuccess);
router.get("/checkout/cancel",shopController.getCheckOut);

// router.post("/create-order", isAuth, shopController.postOrder);
router.get("/orders", isAuth, shopController.getOrders);
router.get("/orders/:orderid", isAuth, shopController.getInvoice);

module.exports = router;
