const { clearCache } = require("ejs");
const Product = require("../models/product");
const { checkout } = require("../routes/admin");
// const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  //   console.log(adminData.products);
  //   res.sendFile(path.join(root, "views", "shop.html"));
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pagetitle: "shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const proId = req.params.productid;
  Product.findById(proId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pagetitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pagetitle: "shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  // Cart.getCart(cart => {
  // console.log(req.user.cart);
  req.user
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        path: "/cart",
        pagetitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const prodid = req.body.productid;
  Product.findById(prodid)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodid = req.body.productId;
  req.user
    .deleteItemFromCart(prodid)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

// exports.postOrder = (req, res, next) => {
//   let fetchedCart;
//   req.user
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then((products) => {
//       return req.user
//         .createOrder()
//         .then((order) => {
//           return order.addProducts(
//             products.map((product) => {
//               product.orderitem = { quantity: product.cartitem.quantity };
//               return product;
//             })
//           );
//         })
//         .catch((err) => console.log(err));
//     })
//     .then((result) => {
//       return fetchedCart.setProducts(null);
//     })
//     .then((result) => {
//       res.redirect("/orders");
//     })
//     .catch((err) => console.log(err));
// };

// exports.getCheckOut = () => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pagetitle: "Checkout",
//   });
// };

// exports.getOrders = (req, res, next) => {
//   req.user
//     .getOrders({ include: ["products"] })
//     .then((orders) => {
//       res.render("shop/orders", {
//         path: "/orders",
//         pagetitle: "Your Orders",
//         orders: orders,
//       });
//     })
//     .catch((err) => console.log(err));
// };
