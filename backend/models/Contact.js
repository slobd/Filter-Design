const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new mongoose.Schema(
  {
    email: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    position: { type: String },
    linkedin: { type: String },
    logo: { type: String },
    company_name: { type: String },
    company_logo: { type: String },
    tags: { type: [Schema.Types.ObjectId], required: true, ref: "Tag" },
    author: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", contactSchema);
