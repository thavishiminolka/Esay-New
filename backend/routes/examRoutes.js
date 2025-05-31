const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const examController = require("../controllers/examController");
const UserPlanPurchase = require("../models/UserPlanPurchase");
const PricePlan = require("../models/PricePlan");
const userAuth = require("../middleware/userAuth");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

// Configure multer file filter
const fileFilter = (req, file, cb) => {
  if (
    file.fieldname === "photo" ||
    file.fieldname.startsWith("questionPhoto-") ||
    file.fieldname.startsWith("answerPhoto-")
  ) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(
        new Error("Photo files must be image format (e.g., JPG, PNG)!"),
        false
      );
    }
  } else if (file.fieldname.startsWith("audio-")) {
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(
        new Error("Audio files must be audio format (e.g., MP3, WAV)!"),
        false
      );
    }
  } else {
    cb(new Error("Unexpected field name!"), false);
  }
};

// Initialize multer with storage, file filter, and limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

// Define upload fields for photo, audio, question photos, and answer photos
const uploadFields = upload.fields([
  { name: "photo", maxCount: 1 },
  ...Array.from({ length: 50 }, (_, i) => ({
    name: `audio-${i}`,
    maxCount: 1,
  })),
  ...Array.from({ length: 50 }, (_, i) => ({
    name: `questionPhoto-${i}`,
    maxCount: 1,
  })),
  ...Array.from({ length: 50 }, (_, i) =>
    Array.from({ length: 4 }, (_, j) => ({
      name: `answerPhoto-${i}-${j}`,
      maxCount: 1,
    }))
  ).flat(),
]);

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  const examId = req.params.id || req.query.examId;
  if (!examId || !mongoose.Types.ObjectId.isValid(examId)) {
    return res.status(400).json({ message: "Invalid exam ID", examId });
  }
  next();
};

// Middleware to verify exam access for students
const verifyExamAccess = async (req, res, next) => {
  try {
    const userId = req.userId;
    const examId = req.params.id || req.query.examId;
    const currentDate = new Date();

    // Find active user plan purchases
    const activePurchases = await UserPlanPurchase.find({
      userId,
      isActive: true,
      $or: [
        { expiryDate: { $gt: currentDate } },
        { expiryDate: null }, // One-time plans
      ],
    }).populate({
      path: "pricePlanId",
      populate: { path: "exams" },
    });

    // Check if the exam is included in any active plan
    const hasAccess = activePurchases.some(
      (purchase) =>
        purchase.pricePlanId &&
        purchase.pricePlanId.exams.some(
          (exam) => exam._id.toString() === examId
        )
    );

    if (!hasAccess) {
      return res
        .status(403)
        .json({ message: "You do not have access to this exam", examId });
    }

    next();
  } catch (error) {
    console.error("Error verifying exam access:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin route: Fetch all exams without authentication
router.get("/admin/exams", async (req, res) => {
  try {
    const exams = await mongoose.model("Exam").find();
    res.status(200).json(exams);
  } catch (error) {
    console.error("Error fetching all exams for admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Student route: Fetch exams based on user plans (authenticated)
router.get("/", userAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const currentDate = new Date();

    // Find active user plan purchases
    const activePurchases = await UserPlanPurchase.find({
      userId,
      isActive: true,
      $or: [
        { expiryDate: { $gt: currentDate } },
        { expiryDate: null }, // One-time plans
      ],
    }).populate({
      path: "pricePlanId",
      populate: { path: "exams" },
    });

    // Extract exam IDs from active plans, filtering out null pricePlanId
    const accessibleExamIds = activePurchases
      .filter((purchase) => purchase.pricePlanId !== null)
      .flatMap((purchase) => purchase.pricePlanId.exams)
      .map((exam) => exam._id.toString());

    // If no accessible exams, return empty array
    if (accessibleExamIds.length === 0) {
      console.log("No accessible exams found for user:", userId);
      return res.status(200).json([]);
    }

    // Fetch exams that the user has access to
    const exams = await mongoose.model("Exam").find({
      _id: { $in: accessibleExamIds },
    });

    console.log("Fetched exams for user:", exams); // Debug log
    res.status(200).json(exams || []); // Ensure array is returned
  } catch (error) {
    console.error("Error fetching exams:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// New endpoint: Fetch leaderboard data for a specific exam
router.get(
  "/results/leaderboard",
  userAuth,
  validateObjectId,
  verifyExamAccess,
  async (req, res) => {
    try {
      const examId = req.query.examId;
      console.log("Fetching leaderboard for examId:", examId); // Debug log

      // Fetch all results for the given examId and group by userId to get the highest score
      const results = await mongoose.model("Result").aggregate([
        { $match: { examId } },
        {
          $group: {
            _id: "$userId",
            username: { $first: "$username" }, // Take the first username (should be consistent)
            totalScore: { $max: "$totalScore" }, // Get the highest score
          },
        },
        {
          $project: {
            _id: 0,
            userId: "$_id",
            username: 1,
            totalScore: 1,
          },
        },
      ]);

      if (!results || results.length === 0) {
        console.log("No results found for examId:", examId);
        return res.status(200).json([]);
      }

      // Sort by totalScore in descending order and assign ranks
      const leaderboard = results
        .sort((a, b) => b.totalScore - a.totalScore)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }));

      console.log("Leaderboard data:", leaderboard); // Debug log
      res.status(200).json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res
        .status(500)
        .json({ message: "Failed to fetch leaderboard", error: error.message });
    }
  }
);

router.post(
  "/",
  (req, res, next) => {
    uploadFields(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  examController.createExam
);

router.get(
  "/:id",
  userAuth,
  validateObjectId,
  verifyExamAccess,
  examController.getExamById
);

router.get("/:id/photo", validateObjectId, examController.getExamPhoto);

router.get(
  "/:examId/questions/:questionId/audio",
  validateObjectId,
  examController.getQuestionAudio
);

router.put(
  "/:id",
  validateObjectId,
  (req, res, next) => {
    uploadFields(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  examController.updateExam
);

// Unauthenticated delete for admin
router.delete("/:id", validateObjectId, examController.deleteExam);

module.exports = router;
