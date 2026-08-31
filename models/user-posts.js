const { Schema, model } = require("mongoose");

const userPostsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      unique: true,
    },
    coverImageURL: {
      type: String,
      required: false,
    },
    location : {
        type: String,
        required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  },
);

const UserPosts = model("userPosts", userPostsSchema);

module.exports = UserPosts;