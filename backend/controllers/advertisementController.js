const Advertisement = require("../models/Advertisement");

exports.createAdvertisement = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const { title } = req.body;

    if (!req.file) {
      console.error("No file uploaded");
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imageUrl = req.file.path;
    console.log("Image path:", imageUrl);

    const advertisement = new Advertisement({
      title,
      imageUrl,
    });

    await advertisement.save();
    console.log("Advertisement saved:", advertisement);

    res.status(201).json({
      message: "Advertisement created successfully",
      advertisement,
    });
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};
exports.getAllAdvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.find().sort({ createdAt: -1 });
    res.json(advertisements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
