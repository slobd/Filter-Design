const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gallerySchema = Schema(
  {
    campaign: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Campaign",
    },
    filter_design: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "FilterDesign",
    },
    author: { type: String, required: true },
    path: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Gallery", gallerySchema);
