const mongoose = require("mongoose");

const connectDB = async () => {
  const connString = process.env.MONGO_URI || "mongodb://mongo:27017/movie_db";
  let connected = false;

  while (!connected) {
    try {
      const conn = await mongoose.connect(connString);
      console.log(`Database connected ${conn.connection.host}`);
      console.log(`Using database: ${conn.connection.name}`);
      connected = true;
    } catch (error) {
      console.error(`DB Connection failed: ${error.message}. Retrying in 5 seconds...`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

module.exports = connectDB;
