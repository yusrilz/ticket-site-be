const express = require("express");
const router = express.Router();

// import controller Movie
const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} = require("../controllers/movieController");

// import controller Showtime
const { getShowtimesForMovie } = require("../controllers/showtimeController");

// import middleware
const { protect } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/requireAdmin");

// GET all movies
// POST new movie
router
  .route("/")
  .get(getMovies)
  .post(protect, requireAdmin, createMovie);

// GET movie by ID
// UPDATE movie by ID
// DELETE movie by ID
router
  .route("/:id")
  .get(getMovieById)
  .put(protect, requireAdmin, updateMovie)
  .delete(protect, requireAdmin, deleteMovie);

// GET all showtimes for a movie
router.get("/:movieId/showtimes", getShowtimesForMovie);

module.exports = router;
