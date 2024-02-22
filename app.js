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

const adminData = require("./routes/admin");
const shoproute = require("./routes/shop");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.routes);

app.use(shoproute);

app.use((req, res, next) => {
  res.status(404).render("404", { pagetitle: "not found" });
});

// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000);
