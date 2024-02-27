const Product = require("../models/product");
const { checkout } = require("../routes/admin");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  //   console.log(adminData.products);
  //   res.sendFile(path.join(root, "views", "shop.html"));
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pagetitle: "shop",
      path: "/",
      hasproducts: products.length > 0,
      productCSS: true,
      activeshop: true,
    });
  });
};

exports.getProduct = (req, res, next) => {
  const proId = req.params.productid;
  Product.findById(proId, (product) => {
    res.render("shop/product-detail", {
      product: product,
      pagetitle: product.title,
      path: "/products",
    });
  });
};
exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pagetitle: "shop",
      path: "/",
      hasproducts: products.length > 0,
      productCSS: true,
      activeshop: true,
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find((prod) => {
          prod.id === product.id;
        });
        if (cartProductData) {
          cartProducts.push({ productdata: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pagetitle: "Your cart",
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
