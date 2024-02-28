const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pagetitle: "add-Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  //products.push({ title: req.body.title });
  const title = req.body.title;
  const imageurl = req.body.imageurl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageurl, price, description);
  product
    .save()
    .then(()=>{
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
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

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productid;
  const updatedtitle = req.body.title;
  const updatedurl = req.body.imageurl;
  const updatedprice = req.body.price;
  const updateddesc = req.body.description;
  const updatedProduct = new Product(
    prodId,
    updatedtitle,
    updatedurl,
    updatedprice,
    updateddesc
  );
  updatedProduct.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  const prodid = req.body.productid;
  Product.deleteById(prodid);
  res.redirect("/admin/products");
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
