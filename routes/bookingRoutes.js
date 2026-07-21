const express = require("express");
const router = express.Router();
const { createBooking, getMyBookings, getBookingById, cancelBooking } = require("../controllers/bookingController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/", createBooking);
router.get("/me", getMyBookings);
router.get("/:id", getBookingById);
router.delete("/:id", cancelBooking);

module.exports = router;