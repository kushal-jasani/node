// const http = require("http");
//const routes = require("./routes");
const express = require("express");

const path = require("path");
const bodyparser = require("body-parser");

// const expressHbs = require("express-handlebars");

const app = express();

const errorController = require("./controller/error");
const { mongoConnect } = require("./util/database");
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
  User.findById("65e180abca20dbc7b3fe2781")
    .then((user) => {
      req.user = new User(user.name,user.email,user.cart,user._id);
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminroute);

app.use(shoproute);

app.use(errorController.getNotFound);

mongoConnect(() => {
  app.listen(3000);
});