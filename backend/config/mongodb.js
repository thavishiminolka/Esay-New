// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     mongoose.connection.on('connected', () => console.log("Database connected"));
//     await mongoose.connect(`${process.env.MONGO_URL}/mern-auth`);
//   } catch (error) {
//     console.error('MongoDB connection error:', error.message);
//     process.exit(1); // Exit process on failure
//   }
// };

// module.exports = connectDB;


const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('Database connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;