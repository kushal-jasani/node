const db = require("../util/database");
const Cart = require("./cart");

module.exports = class Product {
  constructor(id, title, imageurl, price, description) {
    this.id = id;
    this.title = title;
    this.imageurl = imageurl;
    this.description = description;
    this.price = price;
  }

  save() {
    db.execute(
      "insert into products(title,price,description,imageurl)values(?,?,?,?)",
      [this.title, this.price, this.description, this.imageurl]
    );
  }

  static fetchAll() {
    return db.execute("select*from products");
  }

  static findById(id) {
    return db.execute("select * from products where products.id=?",[id]);
  }

  static deleteById(id) {}
};
