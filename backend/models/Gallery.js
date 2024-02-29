const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gallerySchema = Schema(
  {
    campaign: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Campaign",
    },
    path: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Gallery", gallerySchema);