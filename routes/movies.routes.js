// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();

// all your routes here

const Movie = require("../models/Movie.model");
const Celebrity = require("../models/Celebrity.model");
const User = require("../models/User");

// all your routes here

// ======================= Create Route =============================

router.get("/create", (req, res, next) => {
  // console.log("test");
  Celebrity.find()
    .then((celebritiesFromDb) => {
      // console.log({ celebritiesFromDb });

      data = {
        allCelebrities: celebritiesFromDb,
      };
      res.render("movies/new-movie", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/create", (req, res, next) => {
  // console.log(req.body.cast);

  const MovieToCreate = {
    title: req.body.title,
    genre: req.body.genre,
    plot: req.body.plot,
    cast: req.body.cast,
  };

  Movie.create(MovieToCreate)
    .then((MovieToCreate) => {
      // console.log({ MovieToCreate });

      // *** res.redirect has have the arguement being the same as you would pass to an a tag in the href.
      res.redirect(`/movies/movies`);
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/movies/new-movie");
      next(err);
    });
});

// ======================= Read Route =============================

router.get("/movies", (req, res, next) => {
  Movie.find()
    .then((moviesFromDb) => {
      // console.log({ moviesFromDb });

      data = {
        movies: moviesFromDb,
      };

      res.render("movies/movies", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/details/:movieId", (req, res, next) => {
  // console.log({ params: req.params.movieId });

  User.findById(req.session.currentlyLoggedIn._id)
    .then((currentlyLoggedIn) => {
      Movie.findById(req.params.movieId)
        .populate("cast")
        .then((movieFromDb) => {
          const movieLiked = currentlyLoggedIn.likedMovies.includes(
            movieFromDb._id
          );
          console.log({ movieLiked });

          data = {
            movie: movieFromDb,
            liked: movieLiked,
          };

          res.render("movies/movie-details", data);
        });
    })
    .catch((err) => console.log(err))

    .catch((err) => {
      // console.log({ err });
    });
});

// ======================= Delete Route =============================

router.post("/:movieId/delete", (req, res, next) => {
  // console.log({ params: req.params.movieId });

  Movie.findByIdAndRemove(req.params.movieId)
    .then((response) => {
      // console.log({ response });

      res.redirect("/movies/movies");
    })
    .catch((err) => {
      // console.log({ err });
    });
});

// ======================= Update Route =============================

router.get("/:movieID/edit", (req, res, next) => {
  Celebrity.find()
    .then((allTheCelebrities) => {
      Movie.findById(req.params.movieID).then((theMovie) => {
        // console.log(theMovie);
        let myCelebrities = [];
        let otherCelebrities = [];
        allTheCelebrities.forEach((eachCelebrity) => {
          if (theMovie.cast.includes(eachCelebrity.id)) {
            // console.log("its the same");
            // console.log(eachCelebrity.name);
            myCelebrities.push(eachCelebrity);
          } else {
            otherCelebrities.push(eachCelebrity);
          }
        });

        res.render("movies/edit-movie", {
          myCelebrities: myCelebrities,
          otherCelebrities: otherCelebrities,
          movieID: req.params.movieID,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/update/:movieID", (req, res, next) => {
  let ids = req.body.cast;

  Movie.findByIdAndUpdate(
    req.params.movieID,
    // {$push: {animals: ids}})
    // we dont need the push anymore because we are pre-filling the
    // checkboxes so all the animals we already have will get sent though again
    // on the next subsequent edit
    { cast: ids }
  )
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
        })
        .catch((err) => {
          console.log({ err });
        });
      // res.render("movies/movie-details");
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
