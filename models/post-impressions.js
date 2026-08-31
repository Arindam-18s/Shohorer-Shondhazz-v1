const { Schema, model } = require("mongoose");

const postImpressionsSchema = new Schema(
  {
    impressionType: {
        type: String,
        enum: ["LIKE", "COMMENT"],
        required: true,
    },
    content: {
      type: String,
      required: function () {
                return this.impressionType === "COMMENT";
      },
    },
    userPostId: {
      type: Schema.Types.ObjectId,
      ref: "userPosts",
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

const PostImpressions = model("postImpressions", postImpressionsSchema);

module.exports = PostImpressions;
