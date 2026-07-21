const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please insert user ID"],
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: [true, "Please insert movie ID"],
    },
    showtimeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Showtime",
        required: [true, "Please insert showtime ID"],
    },
    seats: {
        type: [String],
        required: [true, "Please insert seat numbers"],
    },
    totalPrice: {
        type: Number,
        required: [true, "Please insert total price"],
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);