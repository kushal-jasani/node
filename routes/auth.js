const express = require("express");
const { query, body, check } = require("express-validator");

const router = express.Router();
const authController = require("../controller/auth");
const User = require("../models/user");
const { route } = require("./admin");

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    check("email").isEmail().withMessage("enter valid email").normalizeEmail(),
    body("password", "password has to be valid")
      .isLength({ min: 5 })
      .isAlphanumeric().trim(),
  ],
  authController.postLogin
);
router.post("/logout", authController.postLogout);
router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter valid email address")
      .custom((value, { req }) => {
        // if (value === "kush@gmail.com") {
        //   throw new Error("this email is forbidden");
        // } else {
        //   return true;
        // }
        return User.findOne({ email: value }).then((userdoc) => {
          if (userdoc) {
            return Promise.reject("email already exists,try diffrent one");
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "please enter password with length at least 5 char and only numbers"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmpassword")
    .trim().custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to be match");
      }
      return true;
    }),
  ],

  authController.postSignup
);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);
module.exports = router;
