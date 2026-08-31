const { Schema, model } = require("mongoose");

const businessSchema = new Schema(
  {
    businessName: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    businessType: {
      type: String,
      required: true,
    },
    businessDescription : {
      type: String,
      required: true,
    },
    offers : {
      type: String,
      required: false,
    },
    businessPicture: {
      type: String,
      required: false,
    },
    location : {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String },
    },
},
  {
    timestamps: true,
  },
);

const Business = model("business", businessSchema);

module.exports = Business;