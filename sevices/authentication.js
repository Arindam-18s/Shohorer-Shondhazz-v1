const JWT = require("jsonwebtoken");
const { jwtSecret } = require("../config");

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  return JWT.sign(payload, jwtSecret, { expiresIn: "7d" });
}

function validateToken(token) {
  return JWT.verify(token, jwtSecret);
}

module.exports = { createTokenForUser, validateToken };