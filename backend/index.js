
// const express = require('express');
// const mongoose = require('mongoose');
// const examRoutes = require('./routes/examRoutes');
// const path = require('path');
// const cors = require('cors');

// const app = express();

// // Enable CORS for requests from the frontend (http://localhost:5173)
// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type'],
// }));

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'), {
//   setHeaders: (res) => {
//     console.log('Serving file from /uploads:', res.req.url);
//     res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
//   }
// }));

// // Routes
// app.use('/api/exams', examRoutes);

// // Custom error handler to return JSON
// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err);
//   res.status(500).json({ message: 'Internal server error', error: err.message });
// });

// // MongoDB Connection
// mongoose.connect('mongodb+srv://adminnew:1234@crud.pbgzc.mongodb.net/exam-shedule', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Start Server
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // Ensure uploads directory exists
// const fs = require('fs');
// const uploadsDir = path.join(__dirname, 'public/uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }



// const express = require("express");
// const mongoose = require("mongoose");
// const examRoutes = require("./routes/examRoutes");
// const pricePlanRoutes = require("./routes/pricePlanRoutes"); // Added
// const path = require("path");
// const cors = require("cors");
// const morgan = require("morgan");
// const fs = require("fs");
// const userRoutes = require('./routes/user');
// require('dotenv').config();

// const authRouter = require('./routes/authRoutes');
// require('./cron');
// const connectDB =require('./config/mongodb')


// const cookieParser = require('cookie-parser');




// const app = express();
// const port = process.env.PORT || 5000;
// connectDB();
// // Enable CORS
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "http://localhost:5174"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type"],
//   })
// );

// // Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({origin:allowedOrigins, credentials:true}))
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan("dev"));
// app.use(
//   "/uploads",
//   express.static(path.join(__dirname, "public/uploads"), {
//     setHeaders: (res, path, stat) => {
//       const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
//       const requestOrigin = res.req.headers.origin;
//       if (allowedOrigins.includes(requestOrigin)) {
//         res.setHeader("Access-Control-Allow-Origin", requestOrigin);
//       }
//     },
//   })
// );


// // Routes
// app.use("/api/exams", examRoutes);
// app.use("/api/price-plans", pricePlanRoutes); // Added
// app.use('/api/user', userRoutes);
// app.use('/api/auth',authRouter)

// // Custom error handler
// app.use((err, req, res, next) => {
//   console.error("Unhandled error:", err);
//   if (err instanceof mongoose.Error.CastError && err.path === "_id") {
//     return res.status(400).json({ message: "Invalid ID" });
//   }
//   if (err instanceof mongoose.Error.ValidationError) {
//     return res.status(400).json({
//       message: "Validation error",
//       errors: Object.values(err.errors).map((e) => e.message),
//     });
//   }
//   if (err instanceof mongoose.Error) {
//     return res.status(400).json({ message: err.message });
//   }
//   res.status(500).json({
//     message: "Internal server error",
//     error: err.message,
//   });
// });

// // MongoDB Connection
// if (!process.env.MONGO_URL) {
//   console.error("Error: MONGO_URL not set in .env file!");
//   process.exit(1); // exit app
// }
// mongoose
//   .connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 5000 })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Ensure uploads directory exists
// const uploadsDir = path.join(__dirname, "public/uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
//   console.log(`Created uploads directory at ${uploadsDir}`);
// }

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



const express = require("express");
const mongoose = require("mongoose");
const examRoutes = require("./routes/examRoutes");
const pricePlanRoutes = require("./routes/pricePlanRoutes"); // Added
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const userRoutes = require('./routes/user');
require('dotenv').config();

const authRouter = require('./routes/authRoutes');
require('./cron');
const connectDB = require('./config/mongodb');

const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5000;
connectDB();

// Define allowed origins
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

// Enable CORS
app.use(
  cors({
    origin: allowedOrigins, // Use the allowedOrigins variable here
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "public/uploads"), {
    setHeaders: (res, path, stat) => {
      const requestOrigin = res.req.headers.origin;
      if (allowedOrigins.includes(requestOrigin)) {
        res.setHeader("Access-Control-Allow-Origin", requestOrigin);
      }
    },
  })
);

// Routes
app.use("/api/exams", examRoutes);
app.use("/api/price-plans", pricePlanRoutes); // Added
app.use('/api/user', userRoutes);
app.use('/api/auth', authRouter);

// Custom error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (err instanceof mongoose.Error.CastError && err.path === "_id") {
    return res.status(400).json({ message: "Invalid ID" });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: "Validation error",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }
  if (err instanceof mongoose.Error) {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

// MongoDB Connection
if (!process.env.MONGO_URL) {
  console.error("Error: MONGO_URL not set in .env file!");
  process.exit(1); // exit app
}
mongoose
  .connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created uploads directory at ${uploadsDir}`);
}

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
