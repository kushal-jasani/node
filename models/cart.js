const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  constructor() {
    this.products = [];
    this.totalPrice = 0;
  }
  static addProduct(id,productprice) {
    fs.readFile(p, (err, filecontent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(filecontent);
      }
      const existingproductindex = cart.products.find((prod) => prod.id === id);
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
};
