
// const Result = require('../models/Result');

// const saveResult = async (req, res) => {
//   try {
//     const { examId, questions, totalScore, totalPossibleMarks, percentageScore, timestamp } = req.body;
//     const userId = req.userId;

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

//     // Determine the next attempt number
//     const latestAttempt = await Result.findOne({ examId, userId }).sort({ attempt: -1 });
//     const attempt = latestAttempt ? latestAttempt.attempt + 1 : 1;

//     // Log user data to debug username
//     console.log("User data from req.user:", req.user);

//     // Ensure username is set with a fallback
//     const username = req.user?.username || `User${userId.slice(-4)}`;
//     console.log("Assigned username:", username);

//     // Create new result entry
//     const newResult = new Result({
//       examId,
//       userId,
//       username,
//       questions,
//       totalScore,
//       totalPossibleMarks,
//       percentageScore,
//       timestamp: timestamp || new Date(),
//       attempt,
//     });

//     // Save to database
//     const savedResult = await newResult.save();
//     console.log("Saved result:", savedResult);

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
















const Result = require('../models/result');

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

    // Log user data to debug name and email
    console.log("User data from req.user:", req.user);

    // Ensure name and email are set with fallbacks
    const name = req.user?.name || `User${userId.slice(-4)}`;
    const lName = req.user?.lName || `User${userId.slice(-4)}`;
    const email = req.user?.email || `user${userId.slice(-4)}@example.com`;
    console.log("Assigned name:", name, "Assigned email:", email);

    // Create new result entry
    const newResult = new Result({
      examId,
      userId,
      name,
      lName,
      email,
      questions,
      totalScore,
      totalPossibleMarks,
      percentageScore,
      timestamp: timestamp || new Date(),
      attempt,
    });

    // Save to database
    const savedResult = await newResult.save();
    console.log("Saved result:", savedResult);

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