const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pagetitle: "add-Product",
    path: "/admin/add-product",
    editing: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  //products.push({ title: req.body.title });
  const title = req.body.title;
  const imageurl = req.body.imageurl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null,title, imageurl, price, description);
  product.save();
  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const editmode = req.query.edit;
  if (!editmode) {
    return res.redirect("/");
  }
  const prodid = req.params.productid;
  Product.findById(prodid, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pagetitle: "Edit-Product",
      path: "/admin/edit-product",
      editing: editmode,
      product: product,
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pagetitle: "admin products",
      path: "/admin/products",
    });
  });
};
