
const mongoose = require("mongoose");

const pricePlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Plan name is required"],
    trim: true,
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  duration: {
    type: String,
    required: [true, "Duration is required"],
    enum: ["monthly", "yearly", "one-time"],
  },
  exams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
  ],
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PricePlan", pricePlanSchema);
