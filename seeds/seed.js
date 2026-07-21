const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/Users');
const Movie = require('../models/Movies');
const Showtime = require('../models/Showtimes');
const Booking = require('../models/Bookings');

mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://mongo:27017/movie_db');

const importData = async () => {
  try {
    await Booking.deleteMany();
    await Showtime.deleteMany();
    await Movie.deleteMany();
    await User.deleteMany();

    console.log('Old database collections cleared...');

    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash('admin1234!', salt);
    const hashedUserPassword = await bcrypt.hash('user1234!', salt);

    const users = await User.create([
      {
        name: 'Demo Admin',
        email: 'admin@cinematix.test',
        password: hashedAdminPassword,
        role: 'admin'
      },
      {
        name: 'Demo Cinema User',
        email: 'user@cinematix.test',
        password: hashedUserPassword,
        role: 'user'
      },
      {
        name: 'Rina Moviegoer',
        email: 'rina@cinematix.test',
        password: hashedUserPassword,
        role: 'user'
      }
    ]);

    console.log('Test Users seeded (1 Admin, 2 Normal Users)...');

    const movies = await Movie.create([
      {
        title: 'Neon Archipelago',
        genre: 'Action',
        duration: 128,
        rating: '13+',
        releaseDate: "2026-07-10",
        poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500&h=750&fit=crop',
        description: 'A Jakarta courier uncovers a city-wide conspiracy hidden inside a network of midnight cinema reels.'
      },
      {
        title: 'The Last Projectionist',
        genre: 'Drama',
        duration: 116,
        rating: 'SU',
        releaseDate: "2026-08-10",
        poster: 'https://images.pexels.com/photos/7991161/pexels-photo-7991161.jpeg?auto=compress&cs=tinysrgb&w=500&h=750&fit=crop',
        description: 'An aging projectionist races to save a historic cinema as a storm traps one final audience inside.'
      },
      {
        title: 'Orbit 17',
        genre: 'Sci-Fi',
        duration: 142,
        rating: '13+',
        releaseDate: "2026-07-07",
        poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=500&h=750&fit=crop',
        description: 'A rescue crew discovers that a silent space station is still broadcasting memories from its missing crew.'
      },
      {
        title: 'Monsoon Melody',
        genre: 'Romance',
        duration: 104,
        rating: '13+',
        releaseDate: "2026-07-08",
        poster: 'https://images.pexels.com/photos/274937/pexels-photo-274937.jpeg?auto=compress&cs=tinysrgb&w=500&h=750&fit=crop',
        description: 'Two rival musicians write one song together over seven rainy nights in Bandung.'
      },
      {
        title: 'Laugh Track Heroes',
        genre: 'Comedy',
        duration: 98,
        rating: '13+',
        releaseDate: "2026-08-01",
        poster: 'https://images.pexels.com/photos/7991490/pexels-photo-7991490.jpeg?auto=compress&cs=tinysrgb&w=500&h=750&fit=crop',
        description: 'A group of failed comedians accidentally become neighborhood vigilantes.'
      },
      {
        title: 'Children of the Tide',
        genre: 'Adventure',
        duration: 121,
        rating: 'SU',
        releaseDate: "2026-08-17",
        poster: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=500&h=750&fit=crop',
        description: 'A coastal village discovers an ancient promise beneath the waves.'
      },
      {
        title: 'The Glass Court',
        genre: 'Thriller',
        duration: 133,
        rating: '17+',
        releaseDate: "2026-07-11",
        poster: 'https://images.pexels.com/photos/5662857/pexels-photo-5662857.png?auto=compress&cs=tinysrgb&w=500&h=750&fit=crop',
        description: 'A legal thriller where every witness remembers a different version of the same night.'
      },
      {
        title: 'Pixel Hearts',
        genre: 'Family',
        duration: 110,
        rating: 'SU',
        releaseDate: "2026-07-24",
        poster: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=500&h=750&fit=crop',
        description: 'A retro game designer rebuilds her childhood arcade and finds a message hidden in the final level.'
      }
    ]);

    console.log('8 Movies seeded...');

    const showtimes = await Showtime.create([
      {
        movieId: movies[0]._id, // Neon Archipelago
        date: new Date('2026-07-10T00:00:00.000Z'),
        time: '13:00',
        studio: 'Studio 1',
        price: 55000,
        bookedSeats: ['A1', 'A2', 'B1']
      },
      {
        movieId: movies[0]._id, // Neon Archipelago
        date: new Date('2026-07-10T00:00:00.000Z'),
        time: '19:30',
        studio: 'Studio 2',
        price: 65000,
        bookedSeats: []
      },
      {
        movieId: movies[1]._id, // The Last Projectionist
        date: new Date('2026-07-11T00:00:00.000Z'),
        time: '16:00',
        studio: 'Studio 1',
        price: 50000,
        bookedSeats: []
      },
      {
        movieId: movies[1]._id, // The Last Projectionist
        date: new Date('2026-07-11T00:00:00.000Z'),
        time: '19:00',
        studio: 'Studio 1',
        price: 50000,
        bookedSeats: []
      },
      {
        movieId: movies[2]._id, // Orbit 17
        date: new Date('2026-07-12T00:00:00.000Z'),
        time: '20:00',
        studio: 'Premiere Hall',
        price: 85000,
        bookedSeats: []
      },
      {
        movieId: movies[2]._id, // Orbit 17
        date: new Date('2026-07-12T00:00:00.000Z'),
        time: '13:00',
        studio: 'Premiere Hall',
        price: 85000,
        bookedSeats: []
      },
      {
        movieId: movies[3]._id, // Monsoon Melody
        date: new Date('2026-07-12T00:00:00.000Z'),
        time: '18:45',
        studio: 'Studio 2',
        price: 60000,
        bookedSeats: []
      },
      {
        movieId: movies[3]._id, // Monsoon Melody
        date: new Date('2026-07-12T00:00:00.000Z'),
        time: '16:45',
        studio: 'Studio 2',
        price: 60000,
        bookedSeats: []
      },
      {
        movieId: movies[4]._id, // Laugh Track Heroes
        date: new Date('2026-07-13T00:00:00.000Z'),
        time: '14:30',
        studio: 'Studio 1',
        price: 45000,
        bookedSeats: []
      },
      {
        movieId: movies[4]._id, // Laugh Track Heroes
        date: new Date('2026-07-13T00:00:00.000Z'),
        time: '21:30',
        studio: 'Studio 1',
        price: 45000,
        bookedSeats: []
      },
      {
        movieId: movies[5]._id, // Children of the Tide
        date: new Date('2026-08-15T00:00:00.000Z'),
        time: '17:00',
        studio: 'Premiere Hall',
        price: 75000,
        bookedSeats: []
      },
      {
        movieId: movies[5]._id, // Children of the Tide
        date: new Date('2026-08-15T00:00:00.000Z'),
        time: '14:00',
        studio: 'Premiere Hall',
        price: 75000,
        bookedSeats: []
      },
      {
        movieId: movies[7]._id, // Pixel Hearts
        date: new Date('2026-08-01T00:00:00.000Z'),
        time: '11:00',
        studio: 'Studio 2',
        price: 50000,
        bookedSeats: []
      },
      {
        movieId: movies[7]._id, // Pixel Hearts
        date: new Date('2026-08-01T00:00:00.000Z'),
        time: '18:00',
        studio: 'Studio 2',
        price: 50000,
        bookedSeats: []
      }
    ]);

    console.log('Showtimes seeded...');

    await Booking.create([
      {
        userId: users[1]._id, // Demo Cinema User
        movieId: movies[0]._id, // Neon Archipelago
        showtimeId: showtimes[0]._id,
        seats: ['A1', 'A2'],
        totalPrice: 110000, // 2 seats * 55,000
        status: 'confirmed'
      },
      {
        userId: users[2]._id, // Rina Moviegoer
        movieId: movies[0]._id, // Neon Archipelago
        showtimeId: showtimes[0]._id,
        seats: ['B1'],
        totalPrice: 55000, // 1 seat * 55,000
        status: 'confirmed'
      }
    ]);

    console.log('Initial confirmed bookings seeded for Admin Dashboard stats...');
    console.log('DATABASE SUCCESSFULLY SEEDED!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();