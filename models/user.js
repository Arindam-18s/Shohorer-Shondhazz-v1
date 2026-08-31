const { createHmac, randomBytes } = require("crypto"); //createHmac for hashing the password, and randomBytes for generating a random secret key
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../sevices/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["USER", "BUSINESS"],
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  // just before storing user details in db, mongoose will execute this func
  const user = this; //i.e. current user

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString("hex");  // the salt will be calculated after the form input recieved, just before saving to the DB
  const hashedPassword = createHmac("sha256", salt) //sha256 = hashing algo, salt = secret key,
                        .update(user.password)
                        .digest("hex");
  this.salt = salt;
  this.password = hashedPassword;
});

userSchema.static('matchPasswordAndGenerateToken', async function(email, password) {
    const user = await this.findOne({ email });
    if(!user) throw new Error('User not found');
    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt) //sha256 = hashing algo, salt = secret key,
                            .update(password)
                            .digest("hex");

    if(hashedPassword !== userProvidedHash)
        throw new Error('Incorrect Password');

    const token = createTokenForUser(user);
    return token;
});

const User = model("user", userSchema);

module.exports = User;
