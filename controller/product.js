const Product = require("../models/product");
exports.getAddProduct = (req, res, next) => {
  res.render("add-product", {
    pagetitle: "Add-Product",
    path: "/admin/add-product",
    activeproduct: true,
    formCSS: true,
    productCSS: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  //products.push({ title: req.body.title });
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

exports.getProduct = (req, res, next) => {
  //   console.log(adminData.products);
  //   res.sendFile(path.join(root, "views", "shop.html"));
  Product.fetchAll((products) => {
        res.render("shop", {
        prods: products,
        pagetitle: "shop",
        path: "/",
        hasproducts: products.length > 0,
        productCSS: true,
        activeshop: true,
      });
  });
};
