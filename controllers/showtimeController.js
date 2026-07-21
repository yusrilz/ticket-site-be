const mongoose = require("mongoose");
const Showtime = require("../models/Showtimes");
const Movie = require("../models/Movies");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/movies/:movieId/showtimes - Public
const getShowtimesForMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) {
    throw new ApiError(400, "Invalid movie id");
  }

  const movie = await Movie.findById(movieId);
  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  const showtimes = await Showtime.find({ movieId })
    .sort({ date: 1, time: 1 })
    .populate("movieId", "title genre duration rating poster");

  res.status(200).json({
    success: true,
    message: "Showtimes retrieved successfully",
    data: showtimes,
  });
});

// GET /api/showtimes/:id - Public
const getShowtimeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid showtime id");
  }

  const showtime = await Showtime.findById(id).populate(
    "movieId",
    "title genre duration rating poster description"
  );

  if (!showtime) {
    throw new ApiError(404, "Showtime not found");
  }

  res.status(200).json({
    success: true,
    message: "Showtime retrieved successfully",
    data: showtime,
  });
});

// GET /api/showtimes/:id/seats - Public
const ALL_SEATS = (() => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 10;
  const seats = [];
  rows.forEach((row) => {
    for (let i = 1; i <= seatsPerRow; i += 1) {
      seats.push(`${row}${i}`);
    }
  });
  return seats;
})();

const getShowtimeSeats = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid showtime id");
  }

  const showtime = await Showtime.findById(id);
  if (!showtime) {
    throw new ApiError(404, "Showtime not found");
  }

  const bookedSeats = showtime.bookedSeats;
  const availableSeats = ALL_SEATS.filter(
    (seat) => !bookedSeats.includes(seat)
  );

  res.status(200).json({
    success: true,
    message: "Seat availability retrieved successfully",
    data: {
      showtimeId: showtime._id,
      allSeats: ALL_SEATS,
      bookedSeats,
      availableSeats,
    },
  });
});

// Shared validation
const validateShowtimePayload = async (payload, { partial = false } = {}) => {
  const { movieId, date, time, studio, price } = payload;
  const errors = [];

  if (!partial || movieId !== undefined) {
    if (!movieId || !isValidObjectId(movieId)) {
      errors.push("A valid movieId is required.");
    } else {
      const movieExists = await Movie.exists({ _id: movieId });
      if (!movieExists) {
        errors.push("Referenced movie does not exist.");
      }
    }
  }

  if (!partial || date !== undefined) {
    if (!date || Number.isNaN(new Date(date).getTime())) {
      errors.push("A valid date is required.");
    }
  }

  if (!partial || time !== undefined) {
    if (!time || typeof time !== "string" || !time.trim()) {
      errors.push("Time is required.");
    }
  }

  if (!partial || studio !== undefined) {
    if (!studio || typeof studio !== "string" || !studio.trim()) {
      errors.push("Studio is required.");
    }
  }

  if (!partial || price !== undefined) {
    if (price === undefined || price === null || Number(price) <= 0) {
      errors.push("Price must be greater than zero.");
    }
  }

  return errors;
};

// POST /api/showtimes - Admin only
const createShowtime = asyncHandler(async (req, res) => {
  const { movieId, date, time, studio, price } = req.body;

  const errors = await validateShowtimePayload({ movieId, date, time, studio, price });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(" ") });
  }

  const showtime = await Showtime.create({
    movieId,
    date,
    time: time.trim(),
    studio: studio.trim(),
    price,
    bookedSeats: [],
  });

  res.status(201).json({
    success: true,
    message: "Showtime created successfully",
    data: showtime,
  });
});

// PUT /api/showtimes/:id - Admin only
const updateShowtime = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid showtime id");
  }

  const showtime = await Showtime.findById(id);
  if (!showtime) {
    throw new ApiError(404, "Showtime not found");
  }

  const { movieId, date, time, studio, price } = req.body;

  const errors = await validateShowtimePayload(
    { movieId, date, time, studio, price },
    { partial: true }
  );
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(" ") });
  }

  if (movieId !== undefined) showtime.movieId = movieId;
  if (date !== undefined) showtime.date = date;
  if (time !== undefined) showtime.time = time.trim();
  if (studio !== undefined) showtime.studio = studio.trim();
  if (price !== undefined) showtime.price = price;

  await showtime.save();

  res.status(200).json({
    success: true,
    message: "Showtime updated successfully",
    data: showtime,
  });
});

// DELETE /api/showtimes/:id - Admin only
const deleteShowtime = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid showtime id");
  }

  const showtime = await Showtime.findById(id);
  if (!showtime) {
    throw new ApiError(404, "Showtime not found");
  }

  await showtime.deleteOne();

  res.status(200).json({
    success: true,
    message: "Showtime deleted successfully",
  });
});

// GET /api/showtimes - Public
const getAllShowtimes = asyncHandler(async (req, res) => {
  const { movieId, date } = req.query;
  const filter = {};

  if (movieId) {
    if (!isValidObjectId(movieId)) {
      throw new ApiError(400, "Invalid movie id");
    }
    filter.movieId = movieId;
  }

  if (date) {
    filter.date = { $regex: `^${date}` };
  }

  const showtimes = await Showtime.find(filter)
    .sort({ date: 1, time: 1 })
    .populate("movieId", "title genre duration rating poster");

  // Format array instead of { success, data } object, 
  // because the frontend expects it to return an array directly if we use apiClient.get.
  // Wait, looking at getShowtimesForMovie: it returns { success, message, data }. 
  // The frontend `apiClient.ts` does not auto-unwrap `data` unless we tell it to.
  // Let me check how the frontend handles it. 
  // Wait, in `showtimeService.ts` it does: 
  // `const showtimes = await apiClient.get<Showtime[]>(...);`
  // And it expects an array back! Wait, if getShowtimesForMovie returns `{ success, data }`, how did it work?
  // Let's just return what the frontend expects. If the frontend expects an array, we return an array!
  // Actually, I'll return an array directly just in case, but let's check `apiClient.ts` and `showtimeService.ts`.
  // I will just return an array to match the frontend signature `Promise<Showtime[]>`.
  res.status(200).json(showtimes);
});

module.exports = {
  getShowtimesForMovie,
  getAllShowtimes,
  getShowtimeById,
  getShowtimeSeats,
  createShowtime,
  updateShowtime,
  deleteShowtime,
};