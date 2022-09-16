// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();

// all your routes here

const Movie = require('../models/Movie.model');
const Celebrity = require('../models/Celebrity.model');

// all your routes here

// Create Route


router.get('/create', (req,res,next) => {
    console.log('test');
    Celebrity.find()
    .then((celebritiesFromDb) => {
        console.log({celebritiesFromDb});

        data = {
            celebrities: celebritiesFromDb
        }
        res.render('movies/new-movie', data)

    })
    .catch(err => {
        console.log(err);
    })
})

router.post('/create', (req,res,next) => {
    console.log(req.body.cast);

    const MovieToCreate = {
        title: req.body.title,
        genre: req.body.genre,
        plot: req.body.plot,
        cast: req.body.cast,
    }

    Movie.create(MovieToCreate)
    .then(MovieToCreate => {
        console.log({MovieToCreate})

        // *** res.redirect has have the arguement being the same as you would pass to an a tag in the href.
        res.redirect(`/movies/movies`);
    })
    .catch(err => {
        console.log(err);
        res.redirect('movies/new-movie')
        next(err)
    })
})

router.get('/movies', (req,res,next) => {
    Movie.find()
    .then((moviesFromDb) => {
        console.log({moviesFromDb});

        data = {
            movies: moviesFromDb
        }

        res.render('movies/movies', data)
    })
    .catch(err => {
        console.log(err);
    })

})


module.exports = router;