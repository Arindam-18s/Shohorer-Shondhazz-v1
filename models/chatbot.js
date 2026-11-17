// models/chatbot.js
const mongoose = require("mongoose");

// Schema for city attractions/landmarks
const attractionSchema = new mongoose.Schema({
  name: String,
  category: String, // "landmark", "restaurant", "park", "museum", etc.
  description: String,
  address: String,
  latitude: Number,
  longitude: Number,
  rating: Number,
  bestFor: [String], // ["families", "couples", "adventure"]
  openingHours: String,
  estimatedTime: String, // "1-2 hours"
  tags: [String],
  image: String,
});

const Attraction = mongoose.model("Attraction", attractionSchema);

// Schema for storing chat history (optional, for context awareness)
const chatHistorySchema = new mongoose.Schema({
  userMessage: String,
  botResponse: String,
  context: String, // what the user asked about
  createdAt: { type: Date, default: Date.now },
});

const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);

const itinerarySchema = new mongoose.Schema({
  title: String,
  description: String,
  stops: [
    {
      name: String,
      latitude: Number,
      longitude: Number,
      time: String,
      duration: String,
      description: String,
      order: Number
    }
  ],
  area: String, // "north kolkata", "south kolkata", etc
  duration: String, // "2 hours", "evening", etc
  createdAt: { type: Date, default: Date.now }
});

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

module.exports = { Attraction, ChatHistory, Itinerary };