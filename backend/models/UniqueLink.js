const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const uniqueLinkSchema = new mongoose.Schema(
  {
    campaign: { type: Schema.Types.ObjectId, ref: "Campaign", required: true },
    contact: { type: Schema.Types.ObjectId, ref: "Contact", required: true },
    link: { type: String, required: true },
    uses: { type: Number, default: 0 },
    blocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UniqueLink", uniqueLinkSchema);
