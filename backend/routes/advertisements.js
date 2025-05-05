const express = require("express");
const router = express.Router();
const advertisementController = require("../controllers/advertisementController");
const upload = require("../middleware/upload");

// Create a new advertisement
router.post(
  "/",
  upload.single("image"),
  advertisementController.createAdvertisement
);

// Get all advertisements
router.get("/", advertisementController.getAllAdvertisements);

module.exports = router;
