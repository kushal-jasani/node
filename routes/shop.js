const express = require("express");
const path = require("path");
const root = require("../util/path");
const adminData = require("./admin");

const productsController=require('../controller/product')

const router = express.Router();

router.get("/", productsController.getProduct);

module.exports = router;
