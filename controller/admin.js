const Product = require("../models/product");
const mongodb = require("mongodb");
const objid = mongodb.ObjectId;

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
  const product = new Product(
    title,
    price,
    description,
    imageurl,
    null,
    req.user._id
  );
  product
    .save()
    .then((result) => {
      // console.log(result);
      console.log("created product");
      res.redirect("/admin/products");
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
  Product.findById(prodid)
    // Product.findByPk(prodid)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pagetitle: "Edit-Product",
        path: "/admin/edit-product",
        editing: editmode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productid;
  const updatedtitle = req.body.title;
  const updatedurl = req.body.imageurl;
  const updatedprice = req.body.price;
  const updateddesc = req.body.description;
  const product = new Product(
    updatedtitle,
    updatedprice,
    updateddesc,
    updatedurl,
    prodId
  );
  product
    .save()
    .then((result) => {
      console.log("updated product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodid = req.body.productid;
  Product.deleteById(prodid)
    .then(() => {
      console.log("DESTROYED");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pagetitle: "admin products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
