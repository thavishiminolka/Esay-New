const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lName: { type: String, required: true },
  phone: { type: Number, required: true, unique: true }, //unique means sholdn't be duplicate phone numbe
  email: { type: String, required: true, unique: true }, //unique means sholdn't be duplicate emails

  password: { type: String, required: true },
  verifyOtp: { type: String, default: "" },
  verifyOtpExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },
  isActive: { type: Boolean, default: false }, // New field for activation status
  activeUntil: { type: Date, default: null }, // New field for expiry date
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

module.exports = userModel;
