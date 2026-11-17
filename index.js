const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS
require("dotenv").config();

const path = require("path"); //for handling and transforming file paths
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const UserPosts = require("./models/user-posts");
const Businesses = require("./models/businesses")

const userRoute = require("./routes/user");
const UserPostsRoute = require("./routes/user-posts");
const BusinessRoute = require("./routes/businesses");
const OurTopPicks = require("./routes/ourTopPicks");
const chatbotRoute = require("./routes/chatbot");
const cityTours = require("./routes/city-tours");

const app = express();
const PORT = 3005;

mongoose
  .connect("mongodb+srv://ShohorerShondhaz:ShohurePassWord1234@shohurecluster1.lud6feo.mongodb.net/ShohureDB?retryWrites=true&w=majority")
  .then((e) => console.log("MongoDB connected"));

app.set("view engine", "ejs"); //setting up view engine for server side rendering
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({extended : false})); // to handle form data input(like signin/signup) we have to have this middleware
app.use(cookieParser());    //for authentication of the users, we use the cookie generated after the user login
app.use(checkForAuthenticationCookie("token")); //we built this middleware to authenticate users, it takes the browser generated cookie - "token"
app.use((req,res,next)=>{
    res.locals.user = req.user;   //Now every EJS file automatically has: <%= user %>
    next();
});
app.use(express.static(path.resolve("./public")));
app.use(express.json({ limit: "10mb" }));

app.get("/", async (req, res) => {
  const latestPosts = await UserPosts.find({})
    .populate("createdBy")
    .sort({ createdAt: -1 })
    .limit(3);

  res.render("home", {
    user: req.user,
    latestPosts,
  });
});

// console.log("Gemini key exists:", !!process.env.GEMINI_API_KEY);
// console.log(
//   "Gemini key length:",
//   process.env.GEMINI_API_KEY?.length
// );

// app.get("/", (req, res) => {
//   res.render("home", {
//     user:req.user,
//   });
// });

// app.get("/user-posts/happening-now", async(req, res) => {
//   const allPosts = await UserPosts.find({}).populate("createdBy").sort({ createdAt: -1 });
//   res.render("happening-now", {
//     userposts : allPosts,
//   });
// });

app.use("/user", userRoute);
app.use("/user-posts", UserPostsRoute);
app.use("/businesses", BusinessRoute);
app.use("/our-top-picks", OurTopPicks);
app.use("/chatbot", chatbotRoute);
app.use("/city-tours", cityTours);

app.listen(PORT, () => console.log(`server started AT ${PORT}`));
