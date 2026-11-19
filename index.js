const path = require("path");
const fs = require("fs");
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const config = require("./config");
const { connectDB } = require("./config/db");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

// Load every model up front so its collection is created on startup.
const UserPosts = require("./models/user-posts");
require("./models/businesses");
require("./models/user");
require("./models/post-impressions");
require("./models/chatbot");

const userRoute = require("./routes/user");
const UserPostsRoute = require("./routes/user-posts");
const BusinessRoute = require("./routes/businesses");
const OurTopPicks = require("./routes/ourTopPicks");
const chatbotRoute = require("./routes/chatbot");
const cityTours = require("./routes/city-tours");

const app = express();
app.set("trust proxy", 1); // Render terminates HTTPS in front of the app
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Upload folders must exist on a fresh deploy or multer will fail.
const uploadDir = path.resolve("./public/uploads");
for (const sub of ["businesses", "user-posts"]) {
  fs.mkdirSync(path.join(uploadDir, sub), { recursive: true });
}

// Render uses this to decide whether the service is healthy.
app.get("/healthz", (req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({ ok: ready });
});

app.use(express.urlencoded({ extended: false })); // form data (signin/signup)
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token")); // sets req.user from the "token" cookie
app.use((req, res, next) => {
  res.locals.user = req.user; // every EJS view can use <%= user %>
  next();
});
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res, next) => {
  try {
    const latestPosts = await UserPosts.find({})
      .populate("createdBy")
      .sort({ createdAt: -1 })
      .limit(3);
    res.render("home", { user: req.user, latestPosts });
  } catch (err) {
    next(err);
  }
});

app.use("/user", userRoute);
app.use("/user-posts", UserPostsRoute);
app.use("/businesses", BusinessRoute);
app.use("/our-top-picks", OurTopPicks);
app.use("/chatbot", chatbotRoute);
app.use("/city-tours", cityTours);

// Last-resort error handler, so one bad request never crashes the server.
app.use((err, req, res, next) => {
  console.error(`[error] ${req.method} ${req.originalUrl}:`, err);
  if (res.headersSent) return next(err);
  res.status(500).send("Something went wrong. Please try again.");
});

async function start() {
  await connectDB();
  app.listen(config.port, "0.0.0.0", () => {
    console.log(`[server] listening on port ${config.port}`);
  });
}

if (require.main === module) {
  start().catch((err) => {
    console.error("[startup] failed:", err.message);
    process.exit(1); // crash loudly so Render shows the reason in the logs
  });
}

module.exports = app;