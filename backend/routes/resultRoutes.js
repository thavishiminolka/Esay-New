// const express = require('express');
// const router = express.Router();
// const resultController = require('../controllers/resultController');

// // POST route to save exam result
// router.post('/', resultController.saveResult);

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const resultController = require('../controllers/resultController');
// const userAuth = require('../middleware/userAuth');

// // POST route to save exam result
// router.post('/', userAuth, resultController.saveResult);

// module.exports = router;









// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const resultController = require('../controllers/resultController');
// const userAuth = require('../middleware/userAuth');

// // POST route to save exam result
// router.post('/', userAuth, resultController.saveResult);

// // GET route to fetch leaderboard data for a specific exam
// router.get('/leaderboard', userAuth, async (req, res) => {
//   try {
//     const examId = req.query.examId;
//     console.log("Fetching leaderboard for examId:", examId);

//     if (!examId || !mongoose.Types.ObjectId.isValid(examId)) {
//       return res.status(400).json({ message: "Invalid exam ID", examId });
//     }

//     console.log("Running aggregation pipeline for Result collection");
//     const results = await mongoose.model('Result').aggregate([
//       { $match: { examId } },
//       {
//         $group: {
//           _id: "$userId",
//           username: { $first: "$name" },
//           totalScore: { $max: "$totalScore" },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           userId: "$_id",
//           name: 1,
//           totalScore: 1,
//         },
//       },
//     ]);

//     if (!results || results.length === 0) {
//       console.log("No results found for examId:", examId);
//       return res.status(200).json([]);
//     }

//     // Log the results to verify username presence
//     console.log("Aggregation results:", results);

//     // Sort by totalScore in descending order and assign ranks
//     const leaderboard = results
//       .sort((a, b) => b.totalScore - a.totalScore)
//       .map((entry, index) => ({
//         ...entry,
//         rank: index + 1,
//       }));

//     console.log("Leaderboard data:", leaderboard);
//     res.status(200).json(leaderboard);
//   } catch (error) {
//     console.error("Error fetching leaderboard:", error);
//     res.status(500).json({ message: "Failed to fetch leaderboard", error: error.message });
//   }
// });

// module.exports = router;

















const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const resultController = require('../controllers/resultController');
const userAuth = require('../middleware/userAuth');

// POST route to save exam result
router.post('/', userAuth, resultController.saveResult);

// GET route to fetch leaderboard data for a specific exam
router.get('/leaderboard', userAuth, async (req, res) => {
  try {
    const examId = req.query.examId;
    console.log("Fetching leaderboard for examId:", examId);

    if (!examId || !mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({ message: "Invalid exam ID", examId });
    }

    console.log("Running aggregation pipeline for Result collection");
    const results = await mongoose.model('Result').aggregate([
      { $match: { examId } },
      {
        $group: {
          _id: "$userId",
          name: { $first: "$name" },
          lName:{ $first: "$lName" },
          email: { $first: "$email" },
          totalScore: { $max: "$totalScore" },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: 1,
          lName:1,
          email: 1,
          totalScore: 1,
        },
      },
    ]);

    if (!results || results.length === 0) {
      console.log("No results found for examId:", examId);
      return res.status(200).json([]);
    }

    // Log the results to verify name and email presence
    console.log("Aggregation results:", results);

    // Sort by totalScore in descending order and assign ranks
    const leaderboard = results
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    console.log("Leaderboard data:", leaderboard);
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard", error: error.message });
  }
});

module.exports = router;