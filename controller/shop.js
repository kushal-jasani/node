const Product = require("../models/product");
const { checkout } = require("../routes/admin");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  //   console.log(adminData.products);
  //   res.sendFile(path.join(root, "views", "shop.html"));
  Product.fetchAll()
    .then(([rows,fielddata])=>{
      res.render("shop/product-list", {
        prods: rows,
        pagetitle: "shop",
        path: "/",
        // hasproducts: products.length > 0,
        // productCSS: true,
        // activeshop: true,
      });
    })
    .catch(err=>{
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const proId = req.params.productid;
  Product.findById(proId)
  .then(([product])=>{
      console.log(product);
      res.render("shop/product-detail", {
        product: product[0],
        pagetitle: product.title,
        path: "/products",
      });
  })
  .catch(err=>{
    console.log(err)
  });
};
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fielddata]) => {
      res.render("shop/index", {
        prods: rows,
        pagetitle: "shop",
        path: "/",
        // hasproducts: products.length > 0,
        // productCSS: true,
        // activeshop: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productdata: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pagetitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodid = req.body.productid;
  Product.findById(prodid, (product) => {
    Cart.addProduct(prodid, product.price);
  });
  res.redirect("/cart");
};

exports.getCheckOut = () => {
  res.render("shop/checkout", {
    path: "/checkout",
    pagetitle: "Checkout",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pagetitle: "Your Orders",
  });
};
