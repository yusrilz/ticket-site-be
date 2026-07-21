const User = require("../models/Users");
const Movie = require("../models/Movies");
const Showtime = require("../models/Showtimes");
const Booking = require("../models/Bookings");

// @desc    Get system statistics for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Admin Only
const getDashboardStats = async (req, res) => {
    try {
        const [totalUsers, totalMovies, totalShowtimes, totalBookings] = await Promise.all([
            User.countDocuments(),
            Movie.countDocuments(),
            Showtime.countDocuments(),
            Booking.countDocuments()
        ]);

        const confirmedBookings = await Booking.find({ status: "confirmed" });
        const totalRevenue = confirmedBookings.reduce((acc, curr) => acc + curr.totalPrice, 0);

        res.json({
            totalUsers,
            totalMovies,
            totalShowtimes,
            totalBookings,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };