// const http = require("http");
//const routes = require("./routes");
const express = require("express");

const app = express();
app.set('view engine', 'pug');
app.set('views','views');
const path = require("path");

const adminData = require("./routes/admin");
const shoproute = require("./routes/shop");
const bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.routes);

app.use(shoproute);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000);
