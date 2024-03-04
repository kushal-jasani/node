const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
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
      productId: product._id,
      quantity: newquantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items=updatedCartItems;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
// const mongodb = require("mongodb");
// const { mongoConnect, getDb } = require("../util/database");
// const { get } = require("../routes/admin");
// const objid = mongodb.ObjectId;

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }
//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map((i) => {
//       return i.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.items.find((i) => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity,
//           };
//         });
//       });
//   }

//   // addToCart(product) {
//   //   // const cartproduct = this.cart.items.findIndex((cp) => {
//   //   //   return cp._id === product._id;
//   //   // });
//   //   product.quantity = 1;

//   //   const updatedCart = { items: [{ productId: new objid(product._id), quantity: 1 }] };
//   //   console.log("dfdvfd", updatedCart);
//   //   console.log('ccc',cart);
//   //   const db = getDb();
//   //   return db
//   //     .collection("users")
//   //     .updateOne({ _id: new objid(this._id) }, { $set: { cart: updatedCart } });
//   // }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() == product._id.toString();
//     });
//     let newquantity = 1;
//     const updatedCartItems = [...this.cart.items];
//     if (cartProductIndex >= 0) {
//       newquantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newquantity;
//     } else {
//       updatedCartItems.push({
//         productId: new objid(product._id),
//         quantity: newquantity,
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne({ _id: new objid(this._id) }, { $set: { cart: updatedCart } });
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = cart.items.filter((item) => {
//       return item.productId.toString() !== productId.toString();
//     });
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new objid(this._id) },
//         { $set: { cart: updatedCartItems } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           users: {
//             _id: new objid(this._id),
//             name: this.name,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new objid(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       })
//       .catch();
//   }

//   getOrders() {
//     const db = getDb();
//     return db.collection("orders").find({'user._id':new objid(this._id)})
//     .toArray();
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new objid(userId) })
//       .then((users) => {
//         //console.log(users);
//         return users;
//       })
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = User;
