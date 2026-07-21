const express = require("express");
const router = express.Router();

const {
  getShowtimesForMovie,
  getAllShowtimes,
  getShowtimeById,
  getShowtimeSeats,
  createShowtime,
  updateShowtime,
  deleteShowtime,
} = require("../controllers/showtimeController");

const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/adminOnly");

router.get("/", getAllShowtimes);
router.get("/:id", getShowtimeById);
router.get("/:id/seats", getShowtimeSeats);

router.post("/", protect, adminOnly, createShowtime);
router.put("/:id", protect, adminOnly, updateShowtime);
router.delete("/:id", protect, adminOnly, deleteShowtime);

module.exports = router;