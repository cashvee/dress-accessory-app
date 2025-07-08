const express = require("express");
const router = express.Router();
const accessoryData = require("../accessoryData.json");

// Recommend accessories based on color
const recommendAccessories = (color) => {
  return accessoryData.filter((item) =>
    item.tags.includes(color.toLowerCase())
  );
};

// POST /recommend
router.post("/recommend", (req, res) => {
  const { color } = req.body;

  if (!color) {
    return res.status(400).json({ error: "Color is required" });
  }

  const matches = recommendAccessories(color);
  res.json(matches);
});

module.exports = router;
