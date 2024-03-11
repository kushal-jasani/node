const product = require("../models/product");
const Product = require("../models/product");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const objid = mongodb.ObjectId;
const { validationResult } = require("express-validator");
const fileHelper = require("../util/file");

exports.getAddProduct = (req, res, next) => {
  if (!req.session.isLoggedin) {
    return res.redirect("/login");
  }
  res.render("admin/edit-product", {
    pagetitle: "add-Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMsg: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  //products.push({ title: req.body.title });
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);
  console.log(image);
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pagetitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMsg: "attached file is not an image",
      validationErrors: [],
    });
  }
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pagetitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageurl: imageurl,
        price: price,
        description: description,
      },
      errorMsg: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  const imageurl = image.path;
  const product = new Product({
    // _id: new mongoose.Types.ObjectId("65e960d8f48e2ecff5f34c0a"),
    title: title,
    price: price,
    description: description,
    imageurl: imageurl,
    userId: req.user,
  });

  product
    .save()
    .then((result) => {
      // console.log(result);
      console.log("created product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      // return res.status(500).render("admin/edit-product", {
      //   pagetitle: "Add Product",
      //   path: "/admin/add-product",
      //   editing: false,
      //   hasError: true,
      //   product: {
      //     title: title,
      //     imageurl: imageurl,
      //     price: price,
      //     description: description,
      //   },
      //   errorMsg: "database op failed,try again",
      //   validationErrors: errors.array(),
      // });
      // res.redirect("/500");
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      // throw new Error('dummy');
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pagetitle: "Edit-Product",
        path: "/admin/edit-product",
        editing: editmode,
        product: product,
        hasError: false,
        errorMsg: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productid;
  const updatedtitle = req.body.title;
  const image = req.file;
  const updatedprice = req.body.price;
  const updateddesc = req.body.description;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pagetitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedtitle,
        imageurl: updatedurl,
        price: updatedprice,
        description: updateddesc,
        _id: prodId,
      },
      validationErrors: errors.array(),
      errorMsg: errors.array()[0].msg,
    });
  }
  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedtitle;
      product.price = updatedprice;
      product.description = updateddesc;
      if (image) {
        fileHelper.deleteFile(product.imageurl);
        product.imageurl = image.path;
      }
      return product.save().then((result) => {
        console.log("updated product");
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodid = req.params.productid;
  Product.findById(prodid)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found"));
      }
      fileHelper.deleteFile(product.imageurl);
      return Product.deleteOne({ _id: prodid, userId: req.user._id });
    })
    .then(() => {
      console.log("DESTROYED");
      res.status(200).json({ message: "Success! " });
    })
    .catch((err) => {
      res.status(500).json({message:'deleting failed!'});
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select("title price -_id")
    // .populate("userId",'name')
    .then((products) => {
      // console.log(products);
      res.render("admin/products", {
        prods: products,
        pagetitle: "admin products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
