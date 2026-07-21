require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

// routes
const authRoutes = require("./routes/authRoutes");
const showtimeRoutes = require("./routes/showtimeRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const movieRoutes = require("./routes/movieRoutes");

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173", // ganti sesuai domain frontend
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Call the Database
connectDB();

// Endpoint home - Health Check
app.get("/", (req, res) => {
  res.send({ message: "Ticketing Site API Is Running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/movies", movieRoutes);

// Centralized error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error" : err.message,
  });
});

app.listen(PORT, () => {
  console.log("Port is running on ", PORT);
});
