const PricePlan = require("../models/PricePlan");

exports.createPricePlan = async (req, res, next) => {
  try {
    const { name, price, duration, exams, description } = req.body;

    // Validate exams array
    if (!Array.isArray(exams) || exams.length === 0) {
      return res.status(400).json({ message: "At least one exam is required" });
    }

    const pricePlan = new PricePlan({
      name,
      price: parseFloat(price),
      duration,
      exams,
      description,
    });

    await pricePlan.save();
    // Populate exams for response
    const populatedPlan = await PricePlan.findById(pricePlan._id).populate(
      "exams",
      "topic"
    );
    res.status(201).json({
      message: "Price plan created successfully",
      pricePlan: populatedPlan,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllPricePlans = async (req, res, next) => {
  try {
    const pricePlans = await PricePlan.find()
      .sort({ createdAt: -1 })
      .populate("exams", "topic");
    res.json(pricePlans);
  } catch (err) {
    next(err);
  }
};

exports.getPricePlanById = async (req, res, next) => {
  try {
    const pricePlan = await PricePlan.findById(req.params.id).populate(
      "exams",
      "topic"
    );
    if (!pricePlan) {
      return res.status(400).json({ message: "Price plan not found" });
    }
    res.json(pricePlan);
  } catch (err) {
    next(err);
  }
};

exports.updatePricePlan = async (req, res, next) => {
  try {
    const { name, price, duration, exams, description } = req.body;

    // Validate exams array
    if (!Array.isArray(exams) || exams.length === 0) {
      return res.status(400).json({ message: "At least one exam is required" });
    }

    const pricePlan = await PricePlan.findById(req.params.id);
    if (!pricePlan) {
      return res.status(404).json({ message: "Price plan not found" });
    }

    pricePlan.name = name;
    pricePlan.price = parseFloat(price);
    pricePlan.duration = duration;
    pricePlan.exams = exams;
    pricePlan.description = description;

    await pricePlan.save();
    // Populate exams for response
    const populatedPlan = await PricePlan.findById(pricePlan._id).populate(
      "exams",
      "topic"
    );
    res.json({
      message: "Price plan updated successfully",
      pricePlan: populatedPlan,
    });
  } catch (err) {
    next(err);
  }
};

exports.deletePricePlan = async (req, res, next) => {
  try {
    const pricePlan = await PricePlan.findById(req.params.id);
    if (!pricePlan) {
      return res.status(404).json({ message: "Price plan not found" });
    }

    await pricePlan.deleteOne();
    res.json({ message: "Price plan deleted successfully" });
  } catch (err) {
    next(err);
  }
};
