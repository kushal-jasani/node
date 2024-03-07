const express = require("express");
const path = require("path");
const root = require("../util/path");

const adminController = require("../controller/admin");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post("/add-product",isAuth, adminController.postAddProduct);

router.get("/products", isAuth,adminController.getProducts);
router.get("/edit-product/:productid", isAuth,adminController.getEditProduct);
router.post("/edit-product", isAuth,adminController.postEditProduct);

router.post("/delete-product", isAuth,adminController.postDeleteProduct);


module.exports = router;
