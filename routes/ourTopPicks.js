const { Router } = require("express");
const { Itinerary } = require("../models/chatbot");
const { getTrails } = require("../data/kolkata-trails");

const router = Router();

router.get("/", (req, res) => {
  return res.render("our-top-picks.ejs", {
    user: req.user,
  });
});

// Built-in trails. No database call, so this works even if Mongo is down.
router.get("/trails", (req, res) => {
  res.set("Cache-Control", "public, max-age=3600");
  res.json(getTrails());
});

// Saved itineraries (existing behaviour, unchanged)
router.get("/itineraries", async (req, res) => {
  try {
    const itineraries = await Itinerary.find().sort({ createdAt: -1 });
    res.json(itineraries);
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    res.status(500).json({ error: "Failed to fetch itineraries" });
  }
});

module.exports = router;