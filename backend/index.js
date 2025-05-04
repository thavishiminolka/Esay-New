// // const express = require("express");
// // const mongoose = require("mongoose");
// // const examRoutes = require("./routes/examRoutes");
// // const pricePlanRoutes = require("./routes/pricePlanRoutes"); // Added
// // const path = require("path");
// // const cors = require("cors");
// // const morgan = require("morgan");
// // const fs = require("fs");
// // const userRoutes = require('./routes/user');
// // require('dotenv').config();

// // const authRouter = require('./routes/authRoutes');
// // require('./cron');
// // const connectDB = require('./config/mongodb');

// // const cookieParser = require('cookie-parser');

// // const app = express();
// // const port = process.env.PORT || 5000;
// // connectDB();

// // // Define allowed origins
// // const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

// // // Enable CORS
// // app.use(
// //   cors({
// //     origin: allowedOrigins, // Use the allowedOrigins variable here
// //     methods: ["GET", "POST", "PUT", "DELETE"],
// //     allowedHeaders: ["Content-Type"],
// //     credentials: true,
// //   })
// // );

// // // Middleware
// // app.use(express.json());
// // app.use(cookieParser());
// // app.use(express.urlencoded({ extended: true }));
// // app.use(morgan("dev"));
// // app.use(
// //   "/uploads",
// //   express.static(path.join(__dirname, "public/uploads"), {
// //     setHeaders: (res, path, stat) => {
// //       const requestOrigin = res.req.headers.origin;
// //       if (allowedOrigins.includes(requestOrigin)) {
// //         res.setHeader("Access-Control-Allow-Origin", requestOrigin);
// //       }
// //     },
// //   })
// // );

// // // Routes
// // app.use("/api/exams", examRoutes);
// // app.use("/api/price-plans", pricePlanRoutes); // Added
// // app.use('/api/user', userRoutes);
// // app.use('/api/auth', authRouter);

// // // Custom error handler
// // app.use((err, req, res, next) => {
// //   console.error("Unhandled error:", err);
// //   if (err instanceof mongoose.Error.CastError && err.path === "_id") {
// //     return res.status(400).json({ message: "Invalid ID" });
// //   }
// //   if (err instanceof mongoose.Error.ValidationError) {
// //     return res.status(400).json({
// //       message: "Validation error",
// //       errors: Object.values(err.errors).map((e) => e.message),
// //     });
// //   }
// //   if (err instanceof mongoose.Error) {
// //     return res.status(400).json({ message: err.message });
// //   }
// //   res.status(500).json({
// //     message: "Internal server error",
// //     error: err.message,
// //   });
// // });

// // // MongoDB Connection
// // if (!process.env.MONGO_URL) {
// //   console.error("Error: MONGO_URL not set in .env file!");
// //   process.exit(1); // exit app
// // }
// // mongoose
// //   .connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 5000 })
// //   .then(() => console.log("MongoDB connected"))
// //   .catch((err) => console.error("MongoDB connection error:", err));

// // // Ensure uploads directory exists
// // const uploadsDir = path.join(__dirname, "public/uploads");
// // if (!fs.existsSync(uploadsDir)) {
// //   fs.mkdirSync(uploadsDir, { recursive: true });
// //   console.log(`Created uploads directory at ${uploadsDir}`);
// // }

// // // Start Server
// // app.listen(port, () => {
// //   console.log(`Server running on port ${port}`);
// // });

// const express = require("express");
// const mongoose = require("mongoose");
// const examRoutes = require("./routes/examRoutes");
// const pricePlanRoutes = require("./routes/pricePlanRoutes"); // Added
// const path = require("path");
// const cors = require("cors");
// const morgan = require("morgan");
// const fs = require("fs");
// const userRoutes = require("./routes/userRoutes.js");
// const adminRoutes = require("./routes/admin");
// require("dotenv").config();
// const authRouter = require("./routes/authRoutes");

// require("./cron");
// const connectDB = require("./config/mongodb");
// const cookieParser = require("cookie-parser");

// const app = express();
// const port = process.env.PORT || 5000;
// connectDB();

// // Define allowed origins
// const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

// // Enable CORS
// app.use(
//   cors({
//     origin: allowedOrigins, // Use the allowedOrigins variable here
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type"],
//     credentials: true,
//   })
// );

// // Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan("dev"));
// app.use(
//   "/uploads",
//   express.static(path.join(__dirname, "public/uploads"), {
//     setHeaders: (res, path, stat) => {
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
// app.use("/api/user", userRoutes);
// app.use("/api/auth", authRouter);
// app.use("/api/admin", adminRoutes);

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
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const examRoutes = require("./routes/examRoutes");
const pricePlanRoutes = require("./routes/pricePlanRoutes");
const userPlanPurchaseRoutes = require("./routes/userPlanPurchaseRoutes");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const userRoutes = require("./routes/userRoutes.js");
const adminRoutes = require("./routes/admin");
require("dotenv").config();
const authRouter = require("./routes/authRoutes");

require("./cron");
const connectDB = require("./config/mongodb");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;
connectDB();

// Define allowed origins
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

// Enable CORS
app.use(
  cors({
    origin: allowedOrigins,
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
app.use("/api/price-plans", pricePlanRoutes);
app.use("/api/user-plan-purchases", userPlanPurchaseRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRoutes);

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
  process.exit(1);
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
