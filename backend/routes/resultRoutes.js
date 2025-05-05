// const express = require('express');
// const router = express.Router();
// const resultController = require('../controllers/resultController');

// // POST route to save exam result
// router.post('/', resultController.saveResult);

// module.exports = router;

const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const userAuth = require('../middleware/userAuth');

// POST route to save exam result
router.post('/', userAuth, resultController.saveResult);

module.exports = router;