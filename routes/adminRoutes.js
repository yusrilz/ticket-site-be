const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/adminController");
const { getAllBookings, updateBookingStatus } = require("../controllers/bookingController");
const { protect, requireAdmin } = require("../middleware/auth");

router.use(protect, requireAdmin);

router.get("/stats", getDashboardStats);
router.get("/bookings", getAllBookings);
router.put("/bookings/:id", updateBookingStatus);

module.exports = router;