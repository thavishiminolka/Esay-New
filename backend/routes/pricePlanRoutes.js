const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const pricePlanController = require("../controllers/pricePlanController");

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  const planId = req.params.id;
  if (!planId || !mongoose.Types.ObjectId.isValid(planId)) {
    return res.status(400).json({ message: "Invalid price plan ID" });
  }
  next();
};

// Routes
router.post("/", pricePlanController.createPricePlan);
router.get("/", pricePlanController.getAllPricePlans);
router.get("/:id", validateObjectId, pricePlanController.getPricePlanById);
router.put("/:id", validateObjectId, pricePlanController.updatePricePlan);
router.delete("/:id", validateObjectId, pricePlanController.deletePricePlan);

module.exports = router;

//newwwwwwwwwwwwwww
// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");
// const pricePlanController = require("../controllers/pricePlanController");

// // Middleware to validate ObjectId
// const validateObjectId = (req, res, next) => {
//   const planId = req.params.id;
//   if (!planId || !mongoose.Types.ObjectId.isValid(planId)) {
//     return res.status(400).json({ message: "Invalid price plan ID" });
//   }
//   next();
// };

// // Routes
// router.post("/", pricePlanController.createPricePlan);
// router.get("/", pricePlanController.getAllPricePlans);
// router.get("/:id", validateObjectId, pricePlanController.getPricePlanById);
// router.put("/:id", validateObjectId, pricePlanController.updatePricePlan);
// router.delete("/:id", validateObjectId, pricePlanController.deletePricePlan);

// module.exports = router;
