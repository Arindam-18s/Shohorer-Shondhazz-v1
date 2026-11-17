const { Router } = require("express");
const path = require("path");
const { Itinerary } = require("../models/chatbot"); // Add this import

const router = Router();

router.get("/", (req, res) => {
    return res.render("our-top-picks.ejs", {
        user: req.user,
    });
});

// Get saved itineraries for map display
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