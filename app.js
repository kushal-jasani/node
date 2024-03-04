// const http = require("http");
//const routes = require("./routes");
const express = require("express");
const mongoose = require("mongoose");

const path = require("path");
const bodyparser = require("body-parser");

// const expressHbs = require("express-handlebars");

const app = express();

const errorController = require("./controller/error");
const User = require("./models/user");

// app.engine(
//   'hbs',
//   expressHbs.engine({
//     layoutsDir: "views/layout/",
//     defaultLayout: "mainlayout",
//     extname:'hbs'
//   }));

app.set("view engine", "ejs");
app.set("views", "views");

const adminroute = require("./routes/admin");
const shoproute = require("./routes/shop");
const { log } = require("console");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("65e59edb00faf2cdb9c713e4")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminroute);

app.use(shoproute);

app.use(errorController.getNotFound);

mongoose
  .connect(
    "mongodb+srv://kush:5XCZW5ADqHZDu6Ay@cluster0.1qgxj1a.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "kush",
          email: "kush@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => console.log(err));
