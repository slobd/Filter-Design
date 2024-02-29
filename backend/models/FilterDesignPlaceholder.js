const mongoose = require("mongoose");

const filterDesignPlaceholderSchema = new mongoose.Schema({
  image: { type: String, required: true },
  author: { type: String },
  type: {type: String},
});

module.exports = mongoose.model(
  "FilterDesignPlaceholder",
  filterDesignPlaceholderSchema
);
