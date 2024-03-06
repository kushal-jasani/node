const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getLogin = (req, res, next) => {
  //   const isLoggedin = req.get("Cookie").split('=')[1];
  //   console.log(res.session.isLoggedin);
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pagetitle: "Login",
    errorMsg: message,
  });
};

exports.getSignup = (req, res, next) => {
  //   const isLoggedin = req.get("Cookie").split('=')[1];
  //   console.log(res.session.isLoggedin);
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pagetitle: "Sign Up",
    errorMsg: message,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;
  User.findOne({ email: email })
    .then((userdoc) => {
      if (userdoc) {
        req.flash("error", "email exist already,please pick different one.");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "kushaljasani843445@gmail.com",
            subject: "Contgatulations,signup successful",
            html: "<h1>You have signed up successfully in Shop-Node</h1>",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "invalid email or password");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedin = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "invalid email or password");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pagetitle: "Reset Password",
    errorMsg: message,
  });
};

exports.postReset = (res, req, next) => {
  crypto.randomBytes(32, (err, buf) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buf.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "kushaljasani843445@gmail.com",
          subject: "ALERT:Password Reset",
          html: `<p>You requested password Reset</p>
          <p>Click given <a href="http://localhost:3000/reset/${token}">link</a> to reset password</p>`,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};