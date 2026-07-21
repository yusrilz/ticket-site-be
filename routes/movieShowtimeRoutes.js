const express = require("express");
const router = express.Router();

const { getShowtimesForMovie } = require("../controllers/showtimeController");

router.get("/:movieId/showtimes", getShowtimesForMovie);

module.exports = router;