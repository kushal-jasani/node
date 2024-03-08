const { clearCache } = require("ejs");
const Product = require("../models/product");
const { checkout } = require("../routes/admin");
const Order = require("../models/order");
const order = require("../models/order");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
exports.getProducts = (req, res, next) => {
  //   console.log(adminData.products);
  //   res.sendFile(path.join(root, "views", "shop.html"));
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pagetitle: "shop",
        path: "/",
        isAuthenticated: req.session.isLoggedin,
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
        isAuthenticated: req.session.isLoggedin,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getIndex = (req, res, next) => {
  Product.find()
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
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pagetitle: "Your Cart",
        products: products,
        isAuthenticated: req.session.isLoggedin,
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
    .removeFromCart(prodid)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getCheckOut = () => {
  res.render("shop/checkout", {
    path: "/checkout",
    pagetitle: "Checkout",
  });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pagetitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.getInvoice = (req, res, next) => {
  const orderid = req.params.orderid;
  Order.findById(orderid)
    .then((order) => {
      if (!order) {
        throw new Error("no orders found");
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        throw new Error("Unauthorized access!!");
      }
      const invoiceName = "invoice-" + orderid + ".pdf";
      const invoicePath = path.join("data", "invoice", invoiceName);
      res.setHeader("Content-type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline;filename="' + invoiceName + '"'
      );
      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      pdfDoc.fontSize(26).text("Invoice : Node-Shop", { underline: true });
      pdfDoc.text("________________________________");
      let total=0;
      order.products.forEach(prod=>{
        total += prod.quantity*prod.product.price;
        pdfDoc.text('Title:'+prod.product.title);
        pdfDoc.text('Quantity:'+prod.quantity);
        pdfDoc.text('Price:$'+prod.product.price);
        pdfDoc.text('_______________________________');
      });
      pdfDoc.fontSize(20).text("Total:$"+total);
      pdfDoc.end();
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader("Content-type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     'inline;filename="' + invoiceName + '"'
      //   );

      //   res.send(data);
      // });
      // const file = fs.createReadStream(invoicePath);

      // file.pipe(res);
    })
    .catch((err) => console.log(err));
};
