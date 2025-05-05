// const Result = require('../models/result');

// // Controller to save exam result
// const saveResult = async (req, res) => {
//   try {
//     const { examId, userId, questions, totalScore, totalPossibleMarks, percentageScore, timestamp } = req.body;

//     // Basic validation
//     if (!examId || !userId || !questions || !Array.isArray(questions) || totalScore === undefined || totalPossibleMarks === undefined || percentageScore === undefined) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     // Validate questions array
//     for (const q of questions) {
//       if (!q.questionId || q.correctAnswer === undefined || q.isCorrect === undefined) {
//         return res.status(400).json({ error: 'Invalid question data' });
//       }
//     }

//     // Create new result entry
//     const newResult = new Result({
//       examId,
//       userId,
//       questions,
//       totalScore,
//       totalPossibleMarks,
//       percentageScore,
//       timestamp,
//     });

//     // Save to database
//     const savedResult = await newResult.save();

//     res.status(201).json({
//       message: 'Result saved successfully',
//       result: savedResult,
//     });
//   } catch (error) {
//     console.error('Error saving result:', error);
//     res.status(500).json({ error: 'Failed to save result' });
//   }
// };

// module.exports = { saveResult };







// const Result = require('../models/Result');

// const saveResult = async (req, res) => {
//   try {
//     const { examId, questions, totalScore, totalPossibleMarks, percentageScore, timestamp } = req.body;
//     const userId = req.userId; // Get userId from middleware

//     // Basic validation
//     if (!examId || !userId || !questions || !Array.isArray(questions) || totalScore === undefined || totalPossibleMarks === undefined || percentageScore === undefined) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     // Validate questions array
//     for (const q of questions) {
//       if (!q.questionId || q.correctAnswer === undefined || q.isCorrect === undefined) {
//         return res.status(400).json({ error: 'Invalid question data' });
//       }
//     }

//     // Create new result entry
//     const newResult = new Result({
//       examId,
//       userId,
//       questions,
//       totalScore,
//       totalPossibleMarks,
//       percentageScore,
//       timestamp: timestamp || new Date(),
//     });

//     // Save to database
//     const savedResult = await newResult.save();

//     res.status(201).json({
//       message: 'Result saved successfully',
//       result: savedResult,
//     });
//   } catch (error) {
//     console.error('Error saving result:', error);
//     res.status(500).json({ error: 'Failed to save result' });
//   }
// };

// module.exports = { saveResult };












// const Result = require('../models/Result');

// const saveResult = async (req, res) => {
//   try {
//     const { examId, questions, totalScore, totalPossibleMarks, percentageScore, timestamp } = req.body;
//     const userId = req.userId;

//     // Check for existing result
//     const existingResult = await Result.findOne({ examId, userId });
//     if (existingResult) {
//       return res.status(400).json({ error: 'Result already exists for this user and exam' });
//     }

//     // Basic validation
//     if (!examId || !userId || !questions || !Array.isArray(questions) || totalScore === undefined || totalPossibleMarks === undefined || percentageScore === undefined) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     // Validate questions array
//     for (const q of questions) {
//       if (!q.questionId || q.correctAnswer === undefined || q.isCorrect === undefined) {
//         return res.status(400).json({ error: 'Invalid question data' });
//       }
//     }

//     // Create new result entry
//     const newResult = new Result({
//       examId,
//       userId,
//       questions,
//       totalScore,
//       totalPossibleMarks,
//       percentageScore,
//       timestamp: timestamp || new Date(),
//     });

//     // Save to database
//     const savedResult = await newResult.save();

//     res.status(201).json({
//       message: 'Result saved successfully',
//       result: savedResult,
//     });
//   } catch (error) {
//     console.error('Error saving result:', error);
//     res.status(500).json({ error: 'Failed to save result' });
//   }
// };

// module.exports = { saveResult };









const Result = require('../models/Result');

const saveResult = async (req, res) => {
  try {
    const { examId, questions, totalScore, totalPossibleMarks, percentageScore, timestamp } = req.body;
    const userId = req.userId;

    // Basic validation
    if (!examId || !userId || !questions || !Array.isArray(questions) || totalScore === undefined || totalPossibleMarks === undefined || percentageScore === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate questions array
    for (const q of questions) {
      if (!q.questionId || q.correctAnswer === undefined || q.isCorrect === undefined) {
        return res.status(400).json({ error: 'Invalid question data' });
      }
    }

    // Determine the next attempt number
    const latestAttempt = await Result.findOne({ examId, userId }).sort({ attempt: -1 });
    const attempt = latestAttempt ? latestAttempt.attempt + 1 : 1;

    // Create new result entry
    const newResult = new Result({
      examId,
      userId,
      questions,
      totalScore,
      totalPossibleMarks,
      percentageScore,
      timestamp: timestamp || new Date(),
      attempt,
    });

    // Save to database
    const savedResult = await newResult.save();

    res.status(201).json({
      message: 'Result saved successfully',
      result: savedResult,
    });
  } catch (error) {
    console.error('Error saving result:', error);
    res.status(500).json({ error: 'Failed to save result' });
  }
};

module.exports = { saveResult };