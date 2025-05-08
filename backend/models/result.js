// const mongoose = require('mongoose');

// const resultSchema = new mongoose.Schema({
//   examId: {
//     type: String,
//     required: true,
//   },
//   userId: {
//     type: String,
//     required: true,
//   },
//   questions: [
//     {
//       questionId: {
//         type: String,
//         required: true,
//       },
//       userAnswer: {
//         type: String,
//         default: '',
//       },
//       correctAnswer: {
//         type: String,
//         required: true,
//       },
//       isCorrect: {
//         type: Boolean,
//         required: true,
//       },
//     },
//   ],
//   totalScore: {
//     type: Number,
//     required: true,
//   },
//   totalPossibleMarks: {
//     type: Number,
//     required: true,
//   },
//   percentageScore: {
//     type: Number,
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model('Result', resultSchema);



// const mongoose = require('mongoose');

// const resultSchema = new mongoose.Schema({
//   examId: {
//     type: String,
//     required: true,
//   },
//   userId: {
//     type: String,
//     required: true,
//   },
//   questions: [
//     {
//       questionId: {
//         type: String,
//         required: true,
//       },
//       userAnswer: {
//         type: String,
//         default: '',
//       },
//       correctAnswer: {
//         type: String,
//         required: true,
//       },
//       isCorrect: {
//         type: Boolean,
//         required: true,
//       },
//     },
//   ],
//   totalScore: {
//     type: Number,
//     required: true,
//   },
//   totalPossibleMarks: {
//     type: Number,
//     required: true,
//   },
//   percentageScore: {
//     type: Number,
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
//   attempt: {
//     type: Number,
//     default: 1, // Start with attempt 1
//   },
// });

// module.exports = mongoose.model('Result', resultSchema);






// const mongoose = require('mongoose');

// const resultSchema = new mongoose.Schema({
//   examId: {
//     type: String,
//     required: true,
//   },
//   userId: {
//     type: String,
//     required: true,
//   },
//   name: { // Added name field
//     type: String,
//     required: true,
//   },
//   lName: { // Added last name field
//     type: String,
//     required: true,
//   },
  
//   email: { // Added email field
//     type: String,
//     required: true,
//   },
//   questions: [
//     {
//       questionId: {
//         type: String,
//         required: true,
//       },
//       userAnswer: {
//         type: String,
//         default: '',
//       },
//       correctAnswer: {
//         type: String,
//         required: true,
//       },
//       isCorrect: {
//         type: Boolean,
//         required: true,
//       },
//     },
//   ],
//   totalScore: {
//     type: Number,
//     required: true,
//   },
//   totalPossibleMarks: {
//     type: Number,
//     required: true,
//   },
//   percentageScore: {
//     type: Number,
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
//   attempt: {
//     type: Number,
//     default: 1,
//   },
// });

// module.exports = mongoose.model('Result', resultSchema);












const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  examId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  questions: [
    {
      questionId: {
        type: String,
        required: true,
      },
      userAnswer: {
        type: String,
        default: '',
      },
      correctAnswer: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
      },
    },
  ],
  totalScore: {
    type: Number,
    required: true,
  },
  totalPossibleMarks: {
    type: Number,
    required: true,
  },
  percentageScore: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  startTime: {
    type: Date,
    required: true, // Added to track exam start time
  },
  timeTaken: {
    type: Number, // Time in seconds
    required: true, // Added to store duration
  },
  attempt: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model('Result', resultSchema);