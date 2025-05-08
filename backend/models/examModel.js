

const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    default: "", // Optional for photo-based answers
  },
  photo: {
    type: String, // Store the path to the answer photo
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
});

const questionSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  type: {
    type: String,
    enum: ["reading", "listening"],
    required: true,
  },
  questionText: {
    type: String,
    trim: true,
    default: "", // Optional for photo-based questions
  },
  questionPhoto: {
    type: String, // Store the path to the question photo
  },
  answers: {
    type: [answerSchema],
    validate: {
      validator: function (answers) {
        return answers.length === 4;
      },
      message: "Reading and Listening questions must have exactly four answers",
    },
  },
  audio: {
    type: String,
  },
});

const examSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    trim: true,
  },
  topic: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return (
          /^\d{2}:\d{2}:\d{2}$/.test(value) ||
          /^\d+\s+(minutes?|hours?)$/.test(value)
        );
      },
      message:
        'Duration must be in the format "HH:mm:ss" (e.g., "01:00:00") or "X minutes/hours" (e.g., "60 minutes")',
    },
  },
  readingTimeMinutes: {
    type: String, // Store as string to match frontend input
    trim: true,
    default: "", // Optional field
    validate: {
      validator: function (value) {
        if (!value) return true; // Allow empty string
        const num = parseInt(value);
        return !isNaN(num) && num >= 0 && num <= 120; // Ensure valid minute range
      },
      message: "Reading section time must be between 0 and 120 minutes",
    },
  },
  listeningTimeMinutes: {
    type: String, // Store as string to match frontend input
    trim: true,
    default: "", // Optional field
    validate: {
      validator: function (value) {
        if (!value) return true; // Allow empty string
        const num = parseInt(value);
        return !isNaN(num) && num >= 0 && num <= 120; // Ensure valid minute range
      },
      message: "Listening section time must be between 0 and 120 minutes",
    },
  },
  photo: {
    type: String,
  },
  photoFileName: {
    type: String,
  },
  description: {
    type: String,
  },
  guidelines: [
    {
      type: String,
      trim: true,
    },
  ],
  questions: {
    type: [questionSchema],
    required: true,
    validate: {
      validator: function (questions) {
        return questions.length > 0;
      },
      message: "Exam must have at least one question",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Exam", examSchema);
