const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcryptjs = require("bcryptjs");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const saltRounds = 12;
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(req.body.password, salt))
    .then((hashedPassword) => {
      console.log(`Password hash: ${hashedPassword}`);
      User.create({
        username: req.body.username,
        password: hashedPassword,
      });
      res.redirect("/");
    })
    .catch((error) => next(error));
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  if (req.body.username === "" || req.body.password === "") {
    res.redirect("/login");
    return;
  }

  User.findOne({ username: req.body.username })
    .then((resultFromDB) => {
      if (!resultFromDB) {
        res.redirect("/login");
        return;
      } else if (
        bcryptjs.compareSync(req.body.password, resultFromDB.password)
      ) {
        console.log("found user", resultFromDB);
        req.session.currentlyLoggedIn = resultFromDB;
        console.log(req.session);
        res.redirect("/");
        return;
      } else {
        res.redirect("/login");
      }
    })
    .catch((error) => console.log(error));
});

router.get("/profile", (req, res, next) => {
  User.findById(req.session.currentlyLoggedIn._id)
    .populate("likedMovies")
    .then((theUser) => {
      console.log(theUser);
      res.render("auth/profile", { theUser: theUser });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

module.exports = router;
