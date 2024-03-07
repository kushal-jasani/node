exports.getNotFound = (req, res, next) => {
  res
    .status(404)
    .render("404", {
      pagetitle: "not found",
      path: "/404",
      isAutheticated: req.isLoggedin,
    });
};
exports.get500 = (req, res, next) => {
  res
    .status(500)
    .render("500", {
      pagetitle: "Error!!",
      path: "/500",
      isAutheticated: req.session.isLoggedin,
    });
};
