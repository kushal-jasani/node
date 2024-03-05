const User=require('../models/user')

exports.getLogin = (req, res, next) => {
  //   const isLoggedin = req.get("Cookie").split('=')[1];
//   console.log(res.session.isLoggedin);
  res.render("auth/login", {
    path: "/login",
    pagetitle: "Login",
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("65e59edb00faf2cdb9c713e4")
    .then((user) => {
      req.session.isLoggedin = true;
      req.session.user = user;
      req.session.save(err=>{
        console.log(err);
        res.redirect('/');
      })
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
