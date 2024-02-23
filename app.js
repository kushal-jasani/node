// const http = require("http");
//const routes = require("./routes");
const express = require("express");

const path = require("path");
const bodyparser = require("body-parser");
// const expressHbs = require("express-handlebars");

const app = express();

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
const errorController = require("./controller/error");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminroute);

app.use(shoproute);

app.use(errorController.getNotFound);

// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000);
