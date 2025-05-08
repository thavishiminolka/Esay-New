const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UserPlanPurchase = require("../models/UserPlanPurchase");
const PricePlan = require("../models/PricePlan");
const userAuth = require("../middleware/userAuth");

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  const planId = req.body.pricePlanId;
  if (!planId || !mongoose.Types.ObjectId.isValid(planId)) {
    return res.status(400).json({ message: "Invalid price plan ID" });
  }
  next();
};

// Create a new user plan purchase
router.post("/", userAuth, validateObjectId, async (req, res) => {
  try {
    const { pricePlanId } = req.body;
    const userId = req.userId;

    // Verify price plan exists
    const pricePlan = await PricePlan.findById(pricePlanId);
    if (!pricePlan) {
      return res.status(404).json({ message: "Price plan not found" });
    }

    // Calculate expiry date
    let expiryDate;
    const purchaseDate = new Date();
    if (pricePlan.duration === "monthly") {
      expiryDate = new Date(purchaseDate.setDate(purchaseDate.getDate() + 30));
    } else if (pricePlan.duration === "yearly") {
      expiryDate = new Date(
        purchaseDate.setFullYear(purchaseDate.getFullYear() + 1)
      );
    } else if (pricePlan.duration === "one-time") {
      expiryDate = null; // No expiry for one-time plans
    } else if (pricePlan.duration === "5-minutes") {
      const now = new Date();
      expiryDate = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes in milliseconds
    }

    // Create purchase
    const userPlanPurchase = new UserPlanPurchase({
      userId,
      pricePlanId,
      purchaseDate: new Date(),
      expiryDate,
      isActive: expiryDate ? true : true, // One-time plans are always active
    });

    await userPlanPurchase.save();
    res.status(201).json({
      message: "Plan purchased successfully",
      purchase: userPlanPurchase,
    });
  } catch (error) {
    console.error("Error creating user plan purchase:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get active user plan purchases
router.get("/active", userAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const currentDate = new Date();

    const activePurchases = await UserPlanPurchase.find({
      userId,
      isActive: true,
      $or: [
        { expiryDate: { $gt: currentDate } },
        { expiryDate: null }, // One-time plans
      ],
    }).populate("pricePlanId");

    res.status(200).json(activePurchases);
  } catch (error) {
    console.error("Error fetching active purchases:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
