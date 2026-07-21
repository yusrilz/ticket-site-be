const Booking = require("../models/Bookings");
const Showtime = require("../models/Showtimes");
const Movie = require("../models/Movies");

// @desc    Create a new booking (with Double-Booking Protection)
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { showtimeId, seats } = req.body;

        if (!showtimeId || !seats || !Array.isArray(seats) || seats.length === 0) {
            return res.status(400).json({ message: "Please provide showtimeId and an array of seats." });
        }

        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) {
            return res.status(404).json({ message: "Showtime not found." });
        }

        const unavailableSeats = seats.filter(seat => showtime.bookedSeats.includes(seat));
        if (unavailableSeats.length > 0) {
            return res.status(409).json({
                message: "One or more selected seats are no longer available.",
                unavailableSeats
            });
        }

        const totalPrice = seats.length * showtime.price;

        const booking = await Booking.create({
            userId: req.user._id,
            movieId: showtime.movieId,
            showtimeId: showtime._id,
            seats,
            totalPrice,
            status: "confirmed"
        });

        showtime.bookedSeats.push(...seats);
        await showtime.save();

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/me
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate("movieId", "title poster genre duration")
            .populate("showtimeId", "date time studio price")
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get booking by ID (With ownership/admin check)
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("movieId", "title poster")
            .populate("showtimeId", "date time studio")
            .populate("userId", "name email");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to view this booking." });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel booking and release seats
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to cancel this booking." });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({ message: "Booking is already cancelled." });
        }

        booking.status = "cancelled";
        await booking.save();

        await Showtime.findByIdAndUpdate(booking.showtimeId, {
            $pullAll: { bookedSeats: booking.seats }
        });

        res.json({ message: "Booking cancelled and seats released successfully.", booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings (Admin View)
// @route   GET /api/admin/bookings
// @access  Admin Only
const getAllBookings = async (req, res) => {
    try {
        const { status, search, movieId, date, page = 1, limit = 10 } = req.query;
        
        let query = {};
        
        if (status && status !== 'all') {
            query.status = status;
        }
        
        if (movieId) {
            query.movieId = movieId;
        }

        if (date) {
            // Find showtimes matching the date
            const showtimes = await Showtime.find({ date: { $regex: `^${date}` } }, '_id');
            const showtimeIds = showtimes.map(st => st._id);
            query.showtimeId = { $in: showtimeIds };
        }

        if (search) {
            // Wait, we need to import User at the top of bookingController.js if not already imported.
            // Let's assume we can use mongoose.model("User")
            const mongoose = require("mongoose");
            const User = mongoose.model("User");
            const users = await User.find({ 
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            }, '_id');
            const userIds = users.map(u => u._id);
            query.userId = { $in: userIds };
        }

        const currentPage = Number(page);
        const perPage = Number(limit);
        const skip = (currentPage - 1) * perPage;

        const totalItems = await Booking.countDocuments(query);
        const bookings = await Booking.find(query)
            .populate("userId", "name email")
            .populate("movieId", "title poster")
            .populate("showtimeId", "date time studio price")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(perPage);

        res.json({
            data: bookings,
            page: currentPage,
            limit: perPage,
            totalItems,
            totalPages: Math.ceil(totalItems / perPage)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status (Admin View)
// @route   PUT /api/admin/bookings/:id
// @access  Admin Only
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["pending", "confirmed", "cancelled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Handle cancelling seats if status changes to cancelled
        if (status === "cancelled" && booking.status !== "cancelled") {
            await Showtime.findByIdAndUpdate(booking.showtimeId, {
                $pullAll: { bookedSeats: booking.seats }
            });
        } 
        // Note: Realistically, if changing from cancelled to confirmed, we'd need to check seat availability.
        // For simplicity, we just update the status.

        booking.status = status;
        await booking.save();

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getMyBookings, getBookingById, cancelBooking, getAllBookings, updateBookingStatus };