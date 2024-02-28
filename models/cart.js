const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  // constructor() {
  //   this.products = [];
  //   this.totalPrice = 0;
  //   this.qty=
  // }
  static addProduct(id, productprice) {
    fs.readFile(p, (err, filecontent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(filecontent);
      }
      const existingproductindex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingproduct = cart.products[existingproductindex];
      let updatedproduct;
      if (existingproduct) {
        updatedproduct = { ...existingproduct };
        updatedproduct.qty = updatedproduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingproductindex] = updatedproduct;
      } else {
        updatedproduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedproduct];
      }
      cart.totalPrice = cart.totalPrice + +productprice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
  static deleteProduct(id, productprice) {
    fs.readFile(p, (err, filecontent) => {
      if (err) {
        return;
      }
      const updatedcart = { ...JSON.parse(filecontent) };
      const product = updatedcart.products.find((prod) => prod.id === id);
      const productqty = product.qty;
      if (!product) {
        return;
      }
      updatedcart.products = updatedcart.products.filter(
        (prod) => prod.id !== id
      );
      updatedcart.totalPrice =
        updatedcart.totalPrice - productqty * productprice;
      fs.writeFile(p, JSON.stringify(updatedcart), (err, filecontent) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, filecontent) => {
      const cart = JSON.parse(filecontent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
