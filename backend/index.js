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
const paymentRoutes = require("./routes/payment");
require("./cron");
const connectDB = require("./config/mongodb");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const multer = require("multer");
const app = express();
const resultRoutes = require("./routes/resultRoutes");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
  express.static(path.join(__dirname, "/uploads"), {
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
app.use("/payment", paymentRoutes);

app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
app.use("/api/results", resultRoutes);

// Advertisement Schema
const advertisementSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

const Advertisement = mongoose.model("Advertisement", advertisementSchema);

// Video Schema
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Video = mongoose.model("Video", videoSchema);

// Multer Storage Configuration (for advertisements)
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Images only (jpeg, jpg, png)"));
  },
}).single("image");

// Advertisement Routes
app.get("/api/advertisements", async (req, res) => {
  try {
    const advertisements = await Advertisement.find();
    const transformedAds = advertisements.map((ad) => ({
      ...ad._doc,
      id: ad._id.toString(),
      imageUrl: `https://epstopiksir.com/uploads${ad.imageUrl}`,
    }));
    res.json(transformedAds);
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    res.status(500).json({ error: "Failed to fetch advertisements" });
  }
});

app.post("/api/advertisements", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    try {
      const { title } = req.body;
      const imageUrl = `/uploads/${req.file.filename}`;

      const advertisement = new Advertisement({
        title,
        imageUrl,
      });

      await advertisement.save();
      res.status(201).json({
        id: advertisement._id.toString(),
        title: advertisement.title,
        imageUrl: `http://localhost:${port}${imageUrl}`,
      });
    } catch (error) {
      console.error("Error uploading advertisement:", error);
      res.status(500).json({ error: "Failed to upload advertisement" });
    }
  });
});

app.delete("/api/advertisements/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const advertisement = await Advertisement.findByIdAndDelete(id);
    if (!advertisement) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    const imagePath = path.join(
      __dirname,
      "Uploads",
      path.basename(advertisement.imageUrl)
    );
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Error deleting image file:", err);
    });

    res.json({ message: "Advertisement deleted successfully" });
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    res.status(500).json({ error: "Failed to delete advertisement" });
  }
});

// Video Routes
app.get("/api/videos", async (req, res) => {
  try {
    const videos = await Video.find();
    const transformedVideos = videos.map((video) => ({
      ...video._doc,
      id: video._id.toString(),
    }));
    res.json(transformedVideos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

app.post("/api/videos", async (req, res) => {
  try {
    const { title, youtubeUrl } = req.body;
    // Basic YouTube URL validation
    if (
      !youtubeUrl.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/)
    ) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }
    const video = new Video({ title, youtubeUrl });
    await video.save();
    res.status(201).json({
      id: video._id.toString(),
      title: video.title,
      youtubeUrl: video.youtubeUrl,
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ error: "Failed to upload video" });
  }
});

app.delete("/api/videos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ error: "Failed to delete video" });
  }
});

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
const uploadsDir = path.join(__dirname, "/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created uploads directory at ${uploadsDir}`);
}

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
