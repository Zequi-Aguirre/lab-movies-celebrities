// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const Celebrity = require("../models/Celebrity.model");

// all your routes here

// Create Route

router.get("/create", (req, res, next) => {
  console.log("test");
  res.render("celebrities/new-celebrity");
});

router.post("/create", (req, res, next) => {
  // console.log(req.body);

  const CelebrityToCreate = {
    name: req.body.name,
    occupation: req.body.occupation,
    catchPhrase: req.body.catchPhrase,
  };

  Celebrity.create(CelebrityToCreate)
    .then((CelebrityToCreate) => {
      console.log({ CelebrityToCreate });

      // *** res.redirect has have the arguement being the same as you would pass to an a tag in the href.
      res.redirect(`/celebrities/celebrities`);
    })
    .catch((err) => {
      console.log(err);
      res.redirect("celebrities/new-celebrity");
      next(err);
    });
});

router.get("/celebrities", (req, res, next) => {
  Celebrity.find().then((celebritiesFromDb) => {
    // console.log({ celebritiesFromDb });

    data = {
      celebrities: celebritiesFromDb,
    };

    res.render("celebrities/celebrities", data);
  });
});

module.exports = router;
