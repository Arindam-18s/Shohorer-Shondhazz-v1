const { Router } = require("express");
const multer = require("multer");
const axios = require("axios");
const path = require("path"); //so that we dont always have to use the absolute path

const Businesses = require("../models/businesses");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/businesses/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

router.get("/this-week", async(req, res) => {
  const allBusinesses = await Businesses.find({})
    .populate("businessName")
    .sort({ createdAt: -1 });
  return res.render("businesses", {
    user: req.user,
    businesses: allBusinesses,
  });
});

router.post("/", upload.single("businessPicture"), async (req, res) => {
  const { businessType, businessDescription, offers, lat, lng } = req.body;
  let address = null;
  try {
    const geoRes = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: { format: "json", lat, lon: lng },
      headers: { "User-Agent": "your-app-name" }, // Nominatim requires a User-Agent header
    });
    address = geoRes.data.display_name; // e.g. "Park Street, Kolkata, West Bengal, India"
  } catch (err) {
    console.error("Reverse geocoding failed:", err.message); // Not fatal — fall back to just storing coordinates if this fails
  }
  const businesses = await Businesses.create({
    businessType, 
    businessDescription, 
    offers, 
    location: {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      address,
    },
    businessName: req.user._id,
    businessPicture: req.file ? `/uploads/businesses/${req.file.filename}` : null,
  });
  return res.redirect("/businesses/this-week");
});

module.exports = router;
