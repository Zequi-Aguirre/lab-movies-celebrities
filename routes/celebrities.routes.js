// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const Celebrity = require("../models/Celebrity.model");
const Movie = require("../models/Movie.model");

// all your routes here

// Create Route

router.get("/create", (req, res, next) => {
  console.log("test");
  res.render("celebrities/new-celebrity");
});

router.post("/create/:movieID", (req, res, next) => {
  // console.log(req.body);

  const CelebrityToCreate = {
    name: req.body.name,
    occupation: req.body.occupation,
    catchPhrase: req.body.catchPhrase,
  };

  Celebrity.create(CelebrityToCreate)
    .then((CelebrityToCreate) => {
      console.log({ CelebrityToCreate });

      // MOVIE UPDATE

      Movie.findByIdAndUpdate(req.params.movieID, {
        $push: { cast: CelebrityToCreate._id },
      })
        // we dont need the push anymore because we are pre-filling the
        // checkboxes so all the animals we already have will get sent though again
        // on the next subsequent edit
        // { cast: ids }

        .then((result) => {
          // res.redirect("/movies/movies");
          Movie.findById(req.params.movieID)
            .populate("cast")
            .then((movieFromDb) => {
              console.log(movieFromDb);
              data = {
                movie: movieFromDb,
              };

              res.render("movies/movie-details", data);
            });

          // MOVIE UPDATE ENDS
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("celebrities/new-celebrity");
      next(err);
    });
});

router.get("/celebrities", (req, res, next) => {
  Celebrity.find()
    .then((celebritiesFromDb) => {
      // console.log({ celebritiesFromDb });

      data = {
        celebrities: celebritiesFromDb,
      };

      res.render("celebrities/celebrities", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
