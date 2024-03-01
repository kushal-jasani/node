const mongodb = require("mongodb");
const { getDb } = require("../util/database");
const objid = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }
  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((i) => {
      return i.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      });
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() == product._id.toString();
    });
    let newquantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newquantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newquantity;
    } else {
      updatedCartItems.push({
        productId: new objid(product._id),
        quantity: newquantity,
      });
    }
    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne({ _id: new objid(this._id) }, { $set: { cart: updatedCart } });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() === productId.toString();
    });
    const db = getDb();
    return db
      .collection("users")
      .updateOne({ _id: new objid(this._id) }, { $set: { cart: updatedCartItems } });
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new objid(userId) })
      .then((users) => {
        console.log(users);
        return users;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
