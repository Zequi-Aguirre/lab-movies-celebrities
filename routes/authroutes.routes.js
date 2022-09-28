const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Movie = require("../models/Movie.model");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");

// ================================= FUNTIONS ================================= //

function generateRandomPassword(length) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// =============================== sign up =============================== //

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const saltRounds = 12;
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(req.body.password, salt))
    .then((hashedPassword) => {
      // console.log(`Password hash: ${hashedPassword}`);
      User.create({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        tempPassword: false,
      }).then((newUser) => {
        // async..await is not allowed in global scope, must use a wrapper
        async function main() {
          // Generate test SMTP service account from ethereal.email
          // Only needed if you don't have a real mail account for testing
          // let testAccount = await nodemailer.createTestAccount();

          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: "mail.zequi4real.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: process.env.CPANELUSER, // generated ethereal user
              pass: process.env.CPANELPASS, // generated ethereal password
            },
            tls: {
              rejectUnauthorized: false,
            },
          });

          console.log(newUser);

          let emailOptions = {
            from: '"Zequi Movies App! 👻" <admin@zequi4real.com>', // sender address
            to: newUser.email, // list of receivers
            subject: "Thanks for joining!", // Subject line
            // text: "Hello world?", // plain text body
            html: `Hello ${newUser.username}, welcome to Zequi Movies App `, // html body
          };

          // send mail with defined transport object
          let info = await transporter.sendMail(emailOptions);

          console.log("Message sent: %s", info.messageId);
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

          // Preview only available when sending through an Ethereal account
          // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }

        req.flash("success", "Successfully Signed Up");
        req.session.currentlyLoggedIn = newUser;
        res.redirect("/profile");

        main().catch(console.error);
      });
    })
    .catch((error) => next(error));
});

// =============================== log in =============================== //

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

        // add else if statement for when randomPassword Boolean (to be created) is true password = password
      } else if (resultFromDB.tempPassword) {
        if (req.body.password === resultFromDB.password) {
          console.log("found user", resultFromDB);
          req.session.currentlyLoggedIn = resultFromDB;
          console.log(req.session);
          res.render("auth/changepassword", {
            theUser: req.session.currentlyLoggedIn,
          });
          return;
        }
      } else if (
        bcryptjs.compareSync(req.body.password, resultFromDB.password)
      ) {
        console.log("found user", resultFromDB);
        req.session.currentlyLoggedIn = resultFromDB;
        console.log(req.session);
        res.redirect("/profile");
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
      // console.log(theUser);
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

router.post("/:movieID/likeMovie", (req, res, next) => {
  console.log("session ============================================");

  if (!req.session.currentlyLoggedIn) {
    res.redirect("/login");
  } else {
    let id = req.params.movieID;
    // console.log("id ============================================");
    // console.log(id);

    Movie.findById(id)
      .then((movie) => {
        // console.log(
        //   "movie========================================================="
        // );
        // console.log(movie);
        User.findByIdAndUpdate(req.session.currentlyLoggedIn._id, {
          $addToSet: { likedMovies: movie },
        }).then((result) => {
          // console.log("result ============================================");
          // console.log(result);
          res.redirect("/profile");
        });
      })

      // we dont need the push anymore because we are pre-filling the
      // checkboxes so all the animals we already have will get sent though again
      // on the next subsequent edit
      // { likedMovies: ids })

      .catch((err) => {
        console.log(
          "error ========================================================="
        );
        console.log(err);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

router.post("/:movieID/unlikeMovie", (req, res, next) => {
  let id = req.params.movieID;
  // console.log("id ============================================");
  // console.log(id);

  Movie.findById(id)
    .then((movie) => {
      console.log(
        "movie========================================================="
      );
      console.log(movie);
      User.findByIdAndUpdate(req.session.currentlyLoggedIn._id, {
        $pull: { likedMovies: movie._id },
      }).then((result) => {
        // console.log("result ============================================");
        // console.log(result);
        res.redirect("/profile");
      });
    })

    // we dont need the push anymore because we are pre-filling the
    // checkboxes so all the animals we already have will get sent though again
    // on the next subsequent edit
    // { likedMovies: ids })

    .catch((err) => {
      console.log(
        "error ========================================================="
      );
      console.log(err);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/change-password", (req, res, next) => {
  res.render("auth/changepassword", { theUser: req.session.currentlyLoggedIn });
});

router.post("/new-password", (req, res, next) => {
  if (req.body.newpass !== req.body.confirmnewpass) {
    res.redirect("/profile");
    // need to show an error message here but cant yet
  }

  User.findById(req.session.currentlyLoggedIn._id).then((resultFromDB) => {
    if (resultFromDB.tempPassword) {
      const saltRounds = 12;
      bcryptjs
        .genSalt(saltRounds)
        .then((salt) => bcryptjs.hash(req.body.newpass, salt))
        .then((hashedPassword) => {
          User.findByIdAndUpdate(req.session.currentlyLoggedIn._id, {
            password: hashedPassword,
            tempPassword: false,
          }).then(() => {
            res.redirect("/profile");
          });
        })
        .catch((err) => {
          next(err);
        });
    } else if (bcryptjs.compareSync(req.body.oldpass, resultFromDB.password)) {
      const saltRounds = 12;
      bcryptjs
        .genSalt(saltRounds)
        .then((salt) => bcryptjs.hash(req.body.newpass, salt))
        .then((hashedPassword) => {
          User.findByIdAndUpdate(req.session.currentlyLoggedIn._id, {
            password: hashedPassword,
          }).then(() => {
            res.redirect("/profile");
          });
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

router.get("/passwordreset", (req, res, next) => {
  res.render("auth/passwordreset");
});

router.post("/passwordreset", (req, res, next) => {
  User.find({ email: req.body.email })
    .then((userFromDB) => {
      console.log(
        "BEFORE UPDATE ============================================="
      );
      console.log(
        userFromDB[0] + "============================================="
      );

      const newRandomPassword = generateRandomPassword(8);
      console.log(newRandomPassword);
      User.findByIdAndUpdate(userFromDB[0]._id, {
        password: newRandomPassword,
        tempPassword: true,
      }).then((updatedUser) => {
        console.log(
          "AFTER UPDATE ============================================="
        );
        console.log(
          updatedUser + "============================================="
        );
        // async..await is not allowed in global scope, must use a wrapper
        async function main() {
          // Generate test SMTP service account from ethereal.email
          // Only needed if you don't have a real mail account for testing
          // let testAccount = await nodemailer.createTestAccount();

          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: "mail.zequi4real.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: process.env.CPANELUSER, // generated ethereal user
              pass: process.env.CPANELPASS, // generated ethereal password
            },
            tls: {
              rejectUnauthorized: false,
            },
          });

          console.log(updatedUser);

          let emailOptions = {
            from: '"Zequi Movies App - Password Reset" <admin@zequi4real.com>', // sender address
            to: updatedUser.email, // list of receivers
            subject: "Your password has been reseted", // Subject line
            // text: "Hello world?", // plain text body
            html: `Hello ${updatedUser.username}, your new temporary password is <b>${newRandomPassword}</b> . Log in to your account using this password and change it for a new one. `, // html body
          };

          // send mail with defined transport object
          let info = await transporter.sendMail(emailOptions);

          console.log("Message sent: %s", info.messageId);
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

          // Preview only available when sending through an Ethereal account
          // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }

        req.flash(
          "success",
          "Check your email for your new temporary password"
        );
        res.redirect("/login");

        main().catch(console.error);
      });
    })
    .catch((error) => next(error));
});

module.exports = router;
