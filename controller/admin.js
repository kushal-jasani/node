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
  req.user
    .createProduct({
      title: title,
      price: price,
      imageurl: imageurl,
      description: description,
    })
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
  req.user
  .getProducts({where:{id:prodid}})
  // Product.findByPk(prodid)
    .then((products) => {
      const product=products[0]; 
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
  Product.findByPk(prodId)
    .then((product) => {
      product.title = updatedtitle;
      product.imageurl = updatedurl;
      product.price = updatedprice;
      product.description = updateddesc;
      return product.save();
    })
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
  Product.findByPk(prodid)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log("DESTROYED");
      res.redirect("/admin/products");
    })
    .catch(err=>{console.log(err)});
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
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
