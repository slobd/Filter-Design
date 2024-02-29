const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const campaignFilterDesign = new mongoose.Schema(
  {
    image: { type: String, required: true },
    campaign: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Campaign",
    },
    type: { type: String, enum: ["square", "story", "custom"] },
    author: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FilterDesign", campaignFilterDesign);
