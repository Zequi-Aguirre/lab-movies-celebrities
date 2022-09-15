// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();

// all your routes here

const Movie = require('../models/Movie.model');

// all your routes here

// Create Route


router.get('/create', (req,res,next) => {
    console.log('test');
    res.render('movie/new-movie')
})

router.post('/create', (req,res,next) => {
    console.log(req.body);

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
        res.redirect(`/movies`);
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

})


module.exports = router;