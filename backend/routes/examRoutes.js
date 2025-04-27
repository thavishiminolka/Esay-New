// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');
// const examController = require('../controllers/examController');

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'public/uploads/');
//   },
//   filename: function(req, file, cb) {
//     const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
//     cb(null, uniqueFilename);
//   }
// });

// // Configure multer file filter
// const fileFilter = (req, file, cb) => {
//   if (file.fieldname === 'photo' || file.fieldname.startsWith('questionPhoto-') || file.fieldname.startsWith('answerPhoto-')) {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Photo files must be image format (e.g., JPG, PNG)!'), false);
//     }
//   } else if (file.fieldname.startsWith('audio-')) {
//     if (file.mimetype.startsWith('audio/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Audio files must be audio format (e.g., MP3, WAV)!'), false);
//     }
//   } else {
//     cb(new Error('Unexpected field name!'), false);
//   }
// };

// // Initialize multer with storage, file filter, and limits
// const upload = multer({ 
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 10 * 1024 * 1024 // 10MB max file size
//   }
// });

// // Define upload fields for photo, audio, question photos, and answer photos
// const uploadFields = upload.fields([
//   { name: 'photo', maxCount: 1 },
//   ...Array.from({ length: 20 }, (_, i) => ({ name: `audio-${i}`, maxCount: 1 })),
//   ...Array.from({ length: 20 }, (_, i) => ({ name: `questionPhoto-${i}`, maxCount: 1 })),
//   ...Array.from({ length: 20 }, (_, i) => 
//     Array.from({ length: 4 }, (_, j) => ({ name: `answerPhoto-${i}-${j}`, maxCount: 1 }))
//   ).flat(),
// ]);

// // Routes with error handling for multer
// router.post('/', (req, res, next) => {
//   uploadFields(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       return res.status(400).json({ message: err.message });
//     } else if (err) {
//       return res.status(400).json({ message: err.message });
//     }
//     next();
//   });
// }, examController.createExam);

// router.get('/', examController.getAllExams);

// router.get('/:id', examController.getExamById);

// router.get('/:id/photo', examController.getExamPhoto);

// router.get('/:examId/questions/:questionId/audio', examController.getQuestionAudio);

// router.put('/:id', (req, res, next) => {
//   uploadFields(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       return res.status(400).json({ message: err.message });
//     } else if (err) {
//       return res.status(400).json({ message: err.message });
//     }
//     next();
//   });
// }, examController.updateExam);

// router.delete('/:id', examController.deleteExam);

// module.exports = router;




const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const examController = require("../controllers/examController");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
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
  const examId = req.params.id;
  if (!examId || !mongoose.Types.ObjectId.isValid(examId)) {
    return res.status(400).json({ message: "Invalid exam ID" });
  }
  next();
};

// Routes with error handling for multer
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

router.get("/", examController.getAllExams);

router.get("/:id", validateObjectId, examController.getExamById);

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

router.delete("/:id", validateObjectId, examController.deleteExam);

module.exports = router;
