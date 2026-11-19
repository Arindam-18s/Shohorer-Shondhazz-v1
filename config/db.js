const mongoose = require("mongoose");
const config = require("./index");

// Connects to MongoDB and creates every collection, so they show up in Atlas
// even before the first document is written.
async function connectDB() {
  mongoose.connection.on("error", (e) => console.error("[mongo] error:", e.message));
  mongoose.connection.on("disconnected", () => console.warn("[mongo] disconnected"));

  try {
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 10000 });
  } catch (err) {
    console.error("[mongo] connection failed:", err.message);
    console.error(
      "[mongo] check: (1) the Atlas cluster is not paused, " +
        "(2) Atlas > Network Access allows 0.0.0.0/0, " +
        "(3) the username/password are correct and URL-encoded, " +
        "(4) the database name is in the URI path, e.g. /ShohureDB?"
    );
    throw err;
  }

  const { name, host } = mongoose.connection;
  console.log(`[mongo] connected to database "${name}" on ${host}`);
  if (name === "test") {
    console.warn('[mongo] database is "test": MONGODB_URI has no database name. Add /ShohureDB before the "?".');
  }

  for (const model of Object.values(mongoose.models)) {
    try {
      await model.createCollection();
    } catch (e) {
      if (e.codeName !== "NamespaceExists") {
        console.warn(`[mongo] createCollection(${model.modelName}): ${e.message}`);
      }
    }
  }
}

module.exports = { connectDB };