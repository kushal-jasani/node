// const http = require("http");
//const routes = require("./routes");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const https = require("https");
const fs = require("fs");
const bodyparser = require("body-parser");
require("dotenv").config();


const MongoDBStore = require("connect-mongodb-session")(session);

const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const MONGODBURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.1qgxj1a.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`;
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
// const expressHbs = require("express-handlebars");

const app = express();
const store = new MongoDBStore({
  uri: MONGODBURI,
  collection: "sessions",
});

const csrfprotection = csrf();
// const privetKey = fs.readFileSync("server.key");
// const certificate = fs.readFileSync("server.cert");
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

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const adminroute = require("./routes/admin");
const shoproute = require("./routes/shop");
const authroute = require("./routes/auth");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
// app.use(multer({ dest: "images" })).single('image');
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "secsec",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfprotection);

app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedin;
  res.locals.csrftoken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use("/admin", adminroute);

app.use(shoproute);

app.use(authroute);
app.get("/500", errorController.get500);

app.use(errorController.getNotFound);

// app.use((error, req, res, next) => {
//   res.status(500).render("500", {
//     pagetitle: "Error!!",
//     path: "/500",
//     isAuthenticated: req.session.isLoggedin,
//   });
// });

mongoose
  .connect(MONGODBURI)
  .then((result) => {
    https
      .createServer({ key: privetKey ,cert:certificate}, app)
      .listen(process.env.PORT || 3000);
    // app.listen(process.env.PORT || 3000);
  })
  .catch((err) => console.log(err));
