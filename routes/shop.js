const express = require("express");
const path = require("path");
const root = require("../util/path");
const adminData = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
  //   console.log(adminData.products);
  //   res.sendFile(path.join(root, "views", "shop.html"));
  res.render("shop", {prods:adminData.products,pagetitle:'shop',path:'/'});
});

module.exports = router;
