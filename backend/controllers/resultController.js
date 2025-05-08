
const Result = require('../models/result');

const saveResult = async (req, res) => {
  try {
    const { examId, questions, totalScore, totalPossibleMarks, percentageScore, timestamp, startTime } = req.body;
    const userId = req.userId;

    // Detailed validation
    const missingFields = [];
    if (!examId) missingFields.push('examId');
    if (!userId) missingFields.push('userId');
    if (!questions || !Array.isArray(questions)) missingFields.push('questions (must be an array)');
    if (totalScore === undefined) missingFields.push('totalScore');
    if (totalPossibleMarks === undefined) missingFields.push('totalPossibleMarks');
    if (percentageScore === undefined) missingFields.push('percentageScore');
    if (!startTime) missingFields.push('startTime');

    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // Validate questions array
    for (const q of questions) {
      if (!q.questionId || q.correctAnswer === undefined || q.isCorrect === undefined) {
        console.log('Invalid question data:', q);
        return res.status(400).json({ error: 'Invalid question data: each question must have questionId, correctAnswer, and isCorrect' });
      }
    }

    // Calculate timeTaken (in seconds)
    const endTime = timestamp ? new Date(timestamp) : new Date();
    const start = new Date(startTime);
    const timeTaken = Math.floor((endTime - start) / 1000); // Convert ms to seconds

    if (timeTaken < 0) {
      console.log('Invalid timeTaken:', { startTime, endTime });
      return res.status(400).json({ error: 'Invalid timeTaken: end time is before start time' });
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
      timestamp: endTime,
      startTime: start,
      timeTaken,
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