//  Add your code here
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const movieSchema = new Schema({
    title: { 
        type: String,
    },
    genre: { 
        type: String,
    },
    plot: { 
        type: String,
    },
    cast: { 
        type: Array,
    }
    
}, {
    timestamps: true
})

const Movie = model('Movie', movieSchema);
module.exports = Movie;