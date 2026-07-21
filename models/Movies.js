const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please insert movie title"],
    },
    genre: {
        type: String,
        required: [true, "Please insert movie genre"],
    },
    duration: {
        type: Number,
        required: [true, "Please insert movie duration"],
    },
    rating: {
        type: String,
        required: [true, "Please insert movie rating"],
    },
    poster: {
        type: String,
        required: [true, "Please insert movie poster URL"],
    },
    description: {
        type: String,
        required: [true, "Please insert movie description"],
    },
    releaseDate: {
        type: Date,
        required: [true, "Please insert movie release date"],
    }
}, {timestamps: true} );

module.exports = mongoose.model("Movie", movieSchema);