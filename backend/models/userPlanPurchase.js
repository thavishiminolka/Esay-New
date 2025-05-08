const mongoose = require("mongoose");

const userPlanPurchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "User ID is required"],
  },
  pricePlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PricePlan",
    required: [true, "Price plan ID is required"],
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: [true, "Expiry date is required"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("UserPlanPurchase", userPlanPurchaseSchema);
