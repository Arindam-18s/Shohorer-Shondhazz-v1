const { Router } = require("express");
const User = require("../models/user");
const router = Router();

router.get("/signin", (req, res) => {
  // for user signin, this page will show up
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  // for user signup, this page will show up
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, role, password } = req.body;
  await User.create({
    role,
    fullName,
    email,
    password,
  });
  return res.redirect("/");
});

router.post("/signin", async (req, res) => {
  // for this, we have to search user by its email, then hash the entered password-
  const { email, password } = req.body; // -and then check the identity by matching those two passwords, we'll use ->
  try {
    // -mongoose virtul function for this, we'll make a function in the
    const token = await User.matchPasswordAndGenerateToken(email, password); //  ../models/user -> matchPassword()
    return res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 7 * 24 * 60 * 60 * 1000 }).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "AHH.. Incorrect Password Try Logging in Again !!",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
