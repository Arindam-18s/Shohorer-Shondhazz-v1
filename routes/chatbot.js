// const express = require("express");
// const router = express.Router();
// const { Attraction, ChatHistory, Itinerary } = require("../models/chatbot");

// // ---------- Area coordinates for radius-based filtering ----------
// const AREA_MAP = {
//   'ahiritola':       { lat: 22.5900, lon: 88.3600, radius: 3 },
//   'north kolkata':   { lat: 22.5900, lon: 88.3600, radius: 5 },
//   'north calcutta':  { lat: 22.5900, lon: 88.3600, radius: 5 },
//   'south kolkata':   { lat: 22.5100, lon: 88.3600, radius: 5 },
//   'south calcutta':  { lat: 22.5100, lon: 88.3600, radius: 5 },
//   'central kolkata': { lat: 22.5726, lon: 88.3639, radius: 4 },
//   'east kolkata':    { lat: 22.5726, lon: 88.4000, radius: 5 },
//   'west kolkata':    { lat: 22.5726, lon: 88.3200, radius: 5 },
//   'park street':     { lat: 22.5540, lon: 88.3580, radius: 2 },
//   'esplanade':       { lat: 22.5630, lon: 88.3500, radius: 2 },
//   'bagbazar':        { lat: 22.5893, lon: 88.3562, radius: 2 },
//   'kumortuli':       { lat: 22.5843, lon: 88.3651, radius: 2 },
//   'kumartuli':       { lat: 22.5843, lon: 88.3651, radius: 2 },
//   'shyambazar':      { lat: 22.5986, lon: 88.3741, radius: 2 },
//   'sovabazar':       { lat: 22.5900, lon: 88.3700, radius: 2 },
// };

// function extractLocationFromQuery(userMessage) {
//   const msg = userMessage.toLowerCase();
//   for (const [area, data] of Object.entries(AREA_MAP)) {
//     if (msg.includes(area)) return { ...data, name: area };
//   }
//   return null;
// }

// function getDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371;
//   const dLat = (lat2 - lat1) * Math.PI / 180;
//   const dLon = (lon2 - lon1) * Math.PI / 180;
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(lat1 * Math.PI / 180) *
//       Math.cos(lat2 * Math.PI / 180) *
//       Math.sin(dLon / 2) ** 2;
//   return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// }

// function filterByRadius(attractions, centerLat, centerLon, radiusKm) {
//   if (!attractions || attractions.length === 0) return [];
//   return attractions.filter(place => {
//     const d = getDistance(centerLat, centerLon, place.latitude, place.longitude);
//     return d <= radiusKm;
//   });
// }

// // ---------- DB fetch ----------
// async function fetchRelevantData(userMessage) {
//   const keywords = userMessage.toLowerCase().split(/\s+/);
//   const stopWords = ['the','a','an','in','at','for','near','around','please','help','me','plan','make','create','give','show'];
//   const cleanKeywords = keywords.filter(k => !stopWords.includes(k) && k.length > 2);

//   const areaInfo = extractLocationFromQuery(userMessage);

//   if (cleanKeywords.length === 0) {
//     const baseQuery = areaInfo
//       ? { tags: { $in: [areaInfo.name, 'kolkata', 'heritage'] } }
//       : {};
//     return await Attraction.find(baseQuery).sort({ rating: -1 }).limit(10);
//   }

//   const query = {
//     $or: [
//       { tags: { $in: cleanKeywords } },
//       { name: { $regex: cleanKeywords.join("|"), $options: "i" } },
//       { category: { $in: cleanKeywords } },
//       { description: { $regex: cleanKeywords.join("|"), $options: "i" } },
//       { address: { $regex: cleanKeywords.join("|"), $options: "i" } }
//     ]
//   };

//   let results = await Attraction.find(query).sort({ rating: -1, _id: -1 }).limit(10);

//   if (results.length === 0 && areaInfo) {
//     results = await Attraction.find({
//       tags: { $in: [areaInfo.name, 'kolkata', 'heritage', 'landmark'] }
//     }).limit(10);
//   }

//   return results;
// }

// function formatContext(attractions) {
//   if (!attractions || attractions.length === 0) return "";
//   let context = "\n\n**Available Locations:**\n";
//   attractions.forEach((place) => {
//     context += `
// - **${place.name}** (${place.category})
//   - Address: ${place.address}
//   - Rating: ${place.rating}/5
//   - Coordinates: [${place.latitude}, ${place.longitude}]
// `;
//   });
//   return context;
// }

// function extractArea(text) {
//   if (text.includes("north")) return "north kolkata";
//   if (text.includes("south")) return "south kolkata";
//   if (text.includes("east")) return "east kolkata";
//   if (text.includes("west")) return "west kolkata";
//   return "kolkata";
// }

// function extractDuration(text) {
//   if (text.includes("evening")) return "evening";
//   if (text.includes("morning")) return "morning";
//   if (text.includes("night")) return "night";
//   return "few hours";
// }

// async function extractAndSaveItinerary(botResponse, userMessage) {
//   if (!botResponse.match(/\d\.\s/)) return null;

//   const locationPattern = /🗺️\s*\[([^\]]+)\]\(map:([-\d.]+),([-\d.]+)\)/g;
//   const stops = [];
//   let match;
//   let order = 1;

//   while ((match = locationPattern.exec(botResponse)) !== null) {
//     stops.push({
//       name: match[1].trim(),
//       latitude: parseFloat(match[2]),
//       longitude: parseFloat(match[3]),
//       time: `${order}:00 PM`,
//       duration: "30-45 mins",
//       description: match[1].trim(),
//       order: order
//     });
//     order++;
//   }

//   if (stops.length >= 2) {
//     try {
//       const newItinerary = new Itinerary({
//         title: userMessage.substring(0, 60).trim() || "Custom Itinerary",
//         description: botResponse.substring(0, 300),
//         stops,
//         area: extractArea(userMessage),
//         duration: extractDuration(userMessage),
//         createdAt: new Date()
//       });
//       return await newItinerary.save();
//     } catch (error) {
//       console.error("Itinerary save error:", error.message);
//       return null;
//     }
//   }
//   return null;
// }

// async function autoSaveMentionedPlaces(botResponse, userMessage) {
//   const placePattern = /🗺️\s*\[([^\]]+)\]\(map:([-\d.]+),([-\d.]+)\)/g;
//   let match;

//   while ((match = placePattern.exec(botResponse)) !== null) {
//     const name = match[1];
//     const latitude = parseFloat(match[2]);
//     const longitude = parseFloat(match[3]);

//     // Skip if coordinates look fake (outside Kolkata bounds)
//     if (latitude < 22 || latitude > 23 || longitude < 88 || longitude > 89) {
//       continue;
//     }

//     const exists = await Attraction.findOne({ name });
//     if (exists) continue;

//     let category = "landmark";
//     if (userMessage.toLowerCase().includes("restaurant")) category = "restaurant";
//     else if (userMessage.toLowerCase().includes("park")) category = "park";
//     else if (userMessage.toLowerCase().includes("temple")) category = "temple";
//     else if (userMessage.toLowerCase().includes("museum")) category = "museum";

//     try {
//       const newAttraction = new Attraction({
//         name,
//         latitude,
//         longitude,
//         category,
//         description: `${name} - discovered from chat`,
//         address: `${name}, Kolkata, West Bengal`,
//         rating: 4.0,
//         bestFor: ["all"],
//         openingHours: "Check online",
//         estimatedTime: "1-2 hours",
//         tags: [category, name.toLowerCase()],
//         image: null
//       });
//       await newAttraction.save();
//     } catch (saveError) {
//       console.error(`Error saving ${name}:`, saveError.message);
//     }
//   }
// }

// router.post("/message", async (req, res) => {
//   try {
//     const { contents } = req.body;
//     const userMessage = contents[0]?.parts[0]?.text || "";

//     const areaInfo = extractLocationFromQuery(userMessage);
//     let relevantAttractions = await fetchRelevantData(userMessage);

//     if (areaInfo) {
//       relevantAttractions = filterByRadius(
//         relevantAttractions,
//         areaInfo.lat,
//         areaInfo.lon,
//         areaInfo.radius
//       );

//       if (relevantAttractions.length === 0) {
//         const nearby = await Attraction.find({
//           tags: { $in: ["north kolkata", "heritage", "landmark"] }
//         }).limit(3);

//         const fallbackText = nearby.length
//           ? `I don't have specific attractions within ${areaInfo.radius}km of ${areaInfo.name}. ` +
//             `However, here are some nearby places you might like:\n\n` +
//             nearby.map(p => `🗺️ [${p.name}](map:${p.latitude},${p.longitude}) - ${p.category}`).join('\n') +
//             `\n\nWould you like more details about any of these?`
//           : `I don't have any attractions near ${areaInfo.name} yet. Try a different area like "Bagbazar" or "Park Street".`;

//         return res.json({
//           candidates: [{ content: { parts: [{ text: fallbackText }] } }],
//           savedItinerary: null
//         });
//       }
//     }

//     const contextData = formatContext(relevantAttractions);

//     const systemPrompt = `
//       You are a local city discovery assistant for Kolkata.

//       CRITICAL RULES:
//       1. ONLY recommend places from the AVAILABLE LOCATIONS list below.
//       2. DO NOT invent coordinates or places not in this list.
//       3. If no relevant places exist, say "I don't have specific information about that area yet".
//       4. Filter recommendations based on the user's requested area.
//       5. For radius queries, only include places within the requested radius.

//       AVAILABLE LOCATIONS:
//       ${contextData}

//       MANDATORY LOCATION FORMAT:
//       🗺️ [Location Name](map:latitude,longitude)
//       - Use EXACT coordinates from the list above.
//       - NEVER invent new locations.
//       - NEVER use placeholder coordinates.
//     `;

//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [
//             {
//               role: "user",
//               parts: [{ text: `${systemPrompt}\n\nUser message: ${userMessage}` }]
//             },
//             ...contents.slice(1)
//           ]
//         }),
//       }
//     );

//     const data = await response.json();
//     if (!response.ok) {
//       return res.status(response.status).json({ error: data.error?.message || "Gemini API error" });
//     }

//     let botResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

//     relevantAttractions.forEach((place) => {
//       const pattern = new RegExp(`🗺️\\s*\\[${place.name}\\]\\([^)]*\\)`, 'g');
//       botResponseText = botResponseText.replace(
//         pattern,
//         `🗺️ [${place.name}](map:${place.latitude},${place.longitude})`
//       );
//     });

//     await autoSaveMentionedPlaces(botResponseText, userMessage);
//     const savedItinerary = await extractAndSaveItinerary(botResponseText, userMessage);

//     data.candidates[0].content.parts[0].text = botResponseText;

//     try {
//       const chatEntry = new ChatHistory({
//         userMessage,
//         botResponse: botResponseText,
//         context: relevantAttractions.map((a) => a.name).join(", "),
//       });
//       await chatEntry.save();
//     } catch (historyError) {
//       console.error("Chat history save error:", historyError);
//     }

//     res.json({
//       candidates: data.candidates,
//       savedItinerary: savedItinerary ? {
//         _id: savedItinerary._id,
//         title: savedItinerary.title,
//         stops: savedItinerary.stops,
//         description: savedItinerary.description,
//         createdAt: savedItinerary.createdAt
//       } : null
//     });

//   } catch (error) {
//     console.error("Chatbot error:", error);
//     res.status(500).json({ error: "Something went wrong with the chatbot" });
//   }
// });

// router.post("/save-location", async (req, res) => {
//   try {
//     const { name, address, latitude, longitude, category, description, rating } = req.body;
//     const exists = await Attraction.findOne({ name });
//     if (exists) return res.json({ message: "Location already exists" });

//     const newAttraction = new Attraction({
//       name,
//       address,
//       latitude,
//       longitude,
//       category: category || "landmark",
//       description: description || "",
//       rating: rating || 4.0,
//       bestFor: ["all"],
//       openingHours: "Check online",
//       estimatedTime: "1-2 hours",
//       tags: [category?.toLowerCase() || "landmark", name.toLowerCase()]
//     });
//     await newAttraction.save();
//     res.json({ success: true, message: "Location saved!" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const { Attraction, ChatHistory, Itinerary } = require("../models/chatbot");

// ---------- Area coordinates ----------
const AREA_MAP = {
  'ahiritola':       { lat: 22.5900, lon: 88.3600, radius: 3 },
  'north kolkata':   { lat: 22.5900, lon: 88.3600, radius: 5 },
  'north calcutta':  { lat: 22.5900, lon: 88.3600, radius: 5 },
  'south kolkata':   { lat: 22.5100, lon: 88.3600, radius: 5 },
  'south calcutta':  { lat: 22.5100, lon: 88.3600, radius: 5 },
  'central kolkata': { lat: 22.5726, lon: 88.3639, radius: 4 },
  'east kolkata':    { lat: 22.5726, lon: 88.4000, radius: 5 },
  'west kolkata':    { lat: 22.5726, lon: 88.3200, radius: 5 },
  'park street':     { lat: 22.5540, lon: 88.3580, radius: 2 },
  'esplanade':       { lat: 22.5630, lon: 88.3500, radius: 2 },
  'bagbazar':        { lat: 22.5893, lon: 88.3562, radius: 2 },
  'kumortuli':       { lat: 22.5843, lon: 88.3651, radius: 2 },
  'kumartuli':       { lat: 22.5843, lon: 88.3651, radius: 2 },
  'shyambazar':      { lat: 22.5986, lon: 88.3741, radius: 2 },
  'sovabazar':       { lat: 22.5900, lon: 88.3700, radius: 2 },
  'burrabazar':      { lat: 22.5800, lon: 88.3550, radius: 1.5 },
  'barabazar':       { lat: 22.5800, lon: 88.3550, radius: 1.5 },
  'borobazar':       { lat: 22.5800, lon: 88.3550, radius: 1.5 },
  'howrah':          { lat: 22.5850, lon: 88.3200, radius: 2 },
  'salt lake':       { lat: 22.5800, lon: 88.4100, radius: 3 },
  'new market':      { lat: 22.5605, lon: 88.3520, radius: 0.8 },
  'ballygunge':      { lat: 22.5250, lon: 88.3650, radius: 1.5 },
  'gariahat':        { lat: 22.5180, lon: 88.3650, radius: 1.0 },
  'kalighat':        { lat: 22.5180, lon: 88.3430, radius: 1.0 },
  'behala':          { lat: 22.4980, lon: 88.3200, radius: 2.0 },
  'chinar park':     { lat: 22.6200, lon: 88.4400, radius: 2.0 },
};

function extractLocationFromQuery(userMessage) {
  const msg = userMessage.toLowerCase();
  for (const [area, data] of Object.entries(AREA_MAP)) {
    if (msg.includes(area)) return { ...data, name: area };
  }
  return null;
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function filterByRadius(attractions, centerLat, centerLon, radiusKm) {
  if (!attractions || attractions.length === 0) return [];
  return attractions.filter(place => {
    const d = getDistance(centerLat, centerLon, place.latitude, place.longitude);
    return d <= radiusKm;
  });
}

// ---------- DB fetch ----------
async function fetchRelevantData(userMessage) {
  const keywords = userMessage.toLowerCase().split(/\s+/);
  const stopWords = ['the','a','an','in','at','for','near','around','please','help','me','plan','make','create','give','show','hey','where','is','are'];
  const cleanKeywords = keywords.filter(k => !stopWords.includes(k) && k.length > 2);

  const areaInfo = extractLocationFromQuery(userMessage);

  if (cleanKeywords.length === 0) {
    const baseQuery = areaInfo
      ? { tags: { $in: [areaInfo.name, 'kolkata', 'heritage'] } }
      : {};
    return await Attraction.find(baseQuery).sort({ rating: -1 }).limit(10);
  }

  // Build a flexible OR query
  const escapedKeywords = cleanKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const query = {
    $or: [
      { tags: { $in: cleanKeywords } },
      { name: { $regex: escapedKeywords.join("|"), $options: "i" } },
      { category: { $in: cleanKeywords } },
      { description: { $regex: escapedKeywords.join("|"), $options: "i" } },
      { address: { $regex: escapedKeywords.join("|"), $options: "i" } }
    ]
  };

  let results = await Attraction.find(query).sort({ rating: -1, _id: -1 }).limit(10);

  if (results.length === 0 && areaInfo) {
    results = await Attraction.find({
      tags: { $in: [areaInfo.name, 'kolkata', 'heritage', 'landmark'] }
    }).limit(10);
  }

  return results;
}

function formatContext(attractions) {
  if (!attractions || attractions.length === 0) return "";
  let context = "\n\n**Verified locations from our database:**\n";
  attractions.forEach((place) => {
    context += `
- **${place.name}** (${place.category})
  - Address: ${place.address}
  - Rating: ${place.rating}/5
  - Coordinates: [${place.latitude}, ${place.longitude}]
`;
  });
  return context;
}

function extractArea(text) {
  if (text.includes("north")) return "north kolkata";
  if (text.includes("south")) return "south kolkata";
  if (text.includes("east")) return "east kolkata";
  if (text.includes("west")) return "west kolkata";
  return "kolkata";
}

function extractDuration(text) {
  if (text.includes("evening")) return "evening";
  if (text.includes("morning")) return "morning";
  if (text.includes("night")) return "night";
  return "few hours";
}

async function extractAndSaveItinerary(botResponse, userMessage) {
  if (!botResponse.match(/\d\.\s/)) return null;

  const locationPattern = /🗺️\s*\[([^\]]+)\]\(map:([-\d.]+),([-\d.]+)\)/g;
  const stops = [];
  let match;
  let order = 1;

  while ((match = locationPattern.exec(botResponse)) !== null) {
    stops.push({
      name: match[1].trim(),
      latitude: parseFloat(match[2]),
      longitude: parseFloat(match[3]),
      time: `${order}:00 PM`,
      duration: "30-45 mins",
      description: match[1].trim(),
      order: order
    });
    order++;
  }

  if (stops.length >= 2) {
    try {
      const newItinerary = new Itinerary({
        title: userMessage.substring(0, 60).trim() || "Custom Itinerary",
        description: botResponse.substring(0, 300),
        stops,
        area: extractArea(userMessage),
        duration: extractDuration(userMessage),
        createdAt: new Date()
      });
      return await newItinerary.save();
    } catch (error) {
      console.error("Itinerary save error:", error.message);
      return null;
    }
  }
  return null;
}

async function autoSaveMentionedPlaces(botResponse, userMessage) {
  const placePattern = /🗺️\s*\[([^\]]+)\]\(map:([-\d.]+),([-\d.]+)\)/g;
  let match;

  while ((match = placePattern.exec(botResponse)) !== null) {
    const name = match[1];
    const latitude = parseFloat(match[2]);
    const longitude = parseFloat(match[3]);

    // Skip if coordinates look fake (outside Kolkata bounds)
    if (latitude < 22 || latitude > 23 || longitude < 88 || longitude > 89) {
      continue;
    }

    const exists = await Attraction.findOne({ name });
    if (exists) continue;

    let category = "landmark";
    const msg = userMessage.toLowerCase();
    if (msg.includes("restaurant")) category = "restaurant";
    else if (msg.includes("park")) category = "park";
    else if (msg.includes("temple")) category = "temple";
    else if (msg.includes("museum")) category = "museum";
    else if (msg.includes("bridge")) category = "landmark";
    else if (msg.includes("club")) category = "landmark";
    else if (msg.includes("golf")) category = "landmark";

    try {
      const newAttraction = new Attraction({
        name,
        latitude,
        longitude,
        category,
        description: `${name} - discovered from chat`,
        address: `${name}, Kolkata, West Bengal`,
        rating: 4.0,
        bestFor: ["all"],
        openingHours: "Check online",
        estimatedTime: "1-2 hours",
        tags: [category, name.toLowerCase()],
        image: null
      });
      await newAttraction.save();
      console.log(`✅ Auto-saved: ${name}`);
    } catch (saveError) {
      console.error(`Error saving ${name}:`, saveError.message);
    }
  }
}

// ---------- MAIN HANDLER ----------
router.post("/message", async (req, res) => {
  try {
    const { contents } = req.body;
    const userMessage = contents[0]?.parts[0]?.text || "";

    const areaInfo = extractLocationFromQuery(userMessage);
    let relevantAttractions = await fetchRelevantData(userMessage);

    // If area mentioned, filter to that radius
    if (areaInfo && relevantAttractions.length > 0) {
      const filtered = filterByRadius(
        relevantAttractions,
        areaInfo.lat,
        areaInfo.lon,
        areaInfo.radius
      );
      // Only use filtered set if it has results, otherwise keep original
      if (filtered.length > 0) relevantAttractions = filtered;
    }

    const contextData = formatContext(relevantAttractions);
    const hasDbData = relevantAttractions.length > 0;

    // ---------- SYSTEM PROMPT ----------
    // Key difference: if no DB data, we TELL Gemini to use its own knowledge
    // and be honest about it, instead of refusing.
    const systemPrompt = `
You are শহুরে_AI, a friendly Kolkata city guide for our website.

RESPONSE STYLE:
- Markdown formatting
- Use **bold** for place names
- Use bullet points for lists, numbered lists for itineraries
- Use emojis sparingly (1-2 per message)
- Be warm, conversational, and specific to Kolkata

${hasDbData ? `
VERIFIED DATA (from our database — prefer these):
${contextData}

When a place exists in the VERIFIED DATA above, use its EXACT coordinates in the map link.
` : `

${areaInfo ? `
IMPORTANT: The user specifically asked about the area "${areaInfo.name}".
- Make "${areaInfo.name}" the CENTERPIECE of your answer, not an afterthought.
- If "${areaInfo.name}" itself is in the VERIFIED DATA, describe it FIRST.
- If "${areaInfo.name}" is NOT in the verified data, but you know it well, describe it from your own knowledge and include it as a stop.
- Only suggest nearby places as ADDITIONS, not replacements.
- Never open with "While X is nice, let me show you Y instead." The user asked for X.
` : ``}

NOTE: Our database has no matching entry for this query. You MUST use your own knowledge of Kolkata to answer.
Use real coordinates that you know are accurate. DO NOT invent fake coordinates.
If you're not confident about a place, say so honestly, but still try your best.
`}

MANDATORY LOCATION FORMAT:
Every place you mention must be formatted as:
🗺️ [Place Name](map:latitude,longitude)

Examples:
🗺️ [Howrah Bridge](map:22.5851,88.3468)
🗺️ [Royal Calcutta Golf Club](map:22.5042,88.3453)

RULES:
- NEVER say "I don't have specific information" unless you truly know nothing about it.
- If you don't recognize the place, ask the user for clarification instead of refusing.
- Always provide at least 2-3 useful places or facts.
- Coordinates must be real. Never use 0,0 or placeholder values.

Now answer the user's message.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\nUser message: ${userMessage}` }]
            },
            ...contents.slice(1)
          ]
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "Gemini API error" });
    }

    let botResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Force-correct coordinates for known DB places
    relevantAttractions.forEach((place) => {
      const pattern = new RegExp(`🗺️\\s*\\[${place.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]\\([^)]*\\)`, 'g');
      botResponseText = botResponseText.replace(
        pattern,
        `🗺️ [${place.name}](map:${place.latitude},${place.longitude})`
      );
    });

    // Auto-save whatever Gemini mentioned (this is how the DB grows)
    await autoSaveMentionedPlaces(botResponseText, userMessage);
    const savedItinerary = await extractAndSaveItinerary(botResponseText, userMessage);

    data.candidates[0].content.parts[0].text = botResponseText;

    try {
      const chatEntry = new ChatHistory({
        userMessage,
        botResponse: botResponseText,
        context: relevantAttractions.map((a) => a.name).join(", "),
      });
      await chatEntry.save();
    } catch (historyError) {
      console.error("Chat history save error:", historyError);
    }

    res.json({
      candidates: data.candidates,
      savedItinerary: savedItinerary ? {
        _id: savedItinerary._id,
        title: savedItinerary.title,
        stops: savedItinerary.stops,
        description: savedItinerary.description,
        createdAt: savedItinerary.createdAt
      } : null
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Something went wrong with the chatbot" });
  }
});

router.post("/save-location", async (req, res) => {
  try {
    const { name, address, latitude, longitude, category, description, rating } = req.body;
    const exists = await Attraction.findOne({ name });
    if (exists) return res.json({ message: "Location already exists" });

    const newAttraction = new Attraction({
      name,
      address,
      latitude,
      longitude,
      category: category || "landmark",
      description: description || "",
      rating: rating || 4.0,
      bestFor: ["all"],
      openingHours: "Check online",
      estimatedTime: "1-2 hours",
      tags: [category?.toLowerCase() || "landmark", name.toLowerCase()]
    });
    await newAttraction.save();
    res.json({ success: true, message: "Location saved!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;