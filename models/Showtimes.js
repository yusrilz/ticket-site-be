const mongoose = require("mongoose");

const showtimeSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: [true, "Please insert movie ID"],
    },
    date: {
        type: Date,
        required: [true, "Please insert a date"],
    },
    time: {
        type: String,
        required: [true, "Please insert a time"],
    },
    studio: {
        type: String,
        required: [true, "Please insert studio number"],
    },
    price: {
        type: Number,
        required: [true, "Please insert price"],
    },
    bookedSeats: {
        type: [String],
        default: [],
    }
}, {timestamps: true });

module.exports = mongoose.model("Showtime", showtimeSchema);