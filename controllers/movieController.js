const Movie = require("../models/Movies");

/**
 * @desc    Get all movies
 * @route   GET /api/movies
 * @access  Public
 */
const getMovies = async (req, res) => {
  try {

    // query parameters
    const {
      search,
      genre,
      status,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    // filter object
    const filter = {};

    // search based on title (case-insensitive)
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    // filter based on genre (case-insensitive)
    if (genre) {
      filter.genre = {
        $regex: `^${genre}$`,
        $options: "i",
      };
    }

    // filter based on status
    if (status) {
      const now = new Date();
      if (status === 'now_showing') {
        filter.releaseDate = { $lte: now };
      } else if (status === 'coming_soon') {
        filter.releaseDate = { $gt: now };
      }
    }

    // determine sorting
    let sortObj = { createdAt: -1 };
    if (sort) {
      if (sort === 'title') sortObj = { title: 1 };
      else if (sort === 'releaseDate') sortObj = { releaseDate: -1 };
      else if (sort === 'rating') sortObj = { rating: -1 };
    }

    // calculate pagination values
    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;

    // query database
    const movies = await Movie.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(perPage);

    // total data
    const totalMovies = await Movie.countDocuments(filter);

    res.status(200).json({
      totalItems: totalMovies,
      page: currentPage,
      limit: perPage,
      totalPages: Math.ceil(totalMovies / perPage),
      data: movies,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * @desc    Get movie by ID
 * @route   GET /api/movies/:id
 * @access  Public
 */
const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * @desc    Create new movie
 * @route   POST /api/movies
 * @access  Public (temp: should be protected for admin only)
 */
const createMovie = async (req, res) => {
  try {
    // retrieve data from request body
    const {
      title,
      genre,
      duration,
      rating,
      poster,
      description,
      releaseDate,
    } = req.body;

    // create new movie document in MongoDB
    const movie = await Movie.create({
      title,
      genre,
      duration,
      rating,
      poster,
      description,
      releaseDate,
    });

    // send response with the new created movie
    res.status(201).json(movie);

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * @desc    Update movie
 * @route   PUT /api/movies/:id
 * @access  Public (temp: should be protected for admin only)
 */
const updateMovie = async (req, res) => {
  try {
    // get the movie id from the URL
    const { id } = req.params;

    // check if the movie exists in the database
    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    // update the movie based on its ID
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,          // return the updated document
        runValidators: true // run schema validators on the update
      }
    );

    // send response with the updated movie data
    res.status(200).json(updatedMovie);

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * @desc    Delete movie
 * @route   DELETE /api/movies/:id
 * @access  Admin
 */
const deleteMovie = async (req, res) => {
  try {
    // get the movie id from the URL
    const { id } = req.params;

    // check if the movie exists in the database
    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    // delete the movie from the database
    await movie.deleteOne();

    res.status(200).json({
      message: "Movie deleted successfully",
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
