const FilterDesignPlaceholder = require("../models/FilterDesignPlaceholder");

const getPlaceholders = async (req, res) => {
  const placeholders = await FilterDesignPlaceholder.find({
    author: { $in: [""] },
  });
  return res.status(200).json(placeholders);
};

const createPlaceholder = async (req, res) => {
  const placeholder = new FilterDesignPlaceholder({
    image: req.file.path,
    author: req.body.author,
    type: req.body.type,
  });

  try {
    const dataToSave = await placeholder.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};

const deletePlaceholder = async (req, res) => {
  const response = await FilterDesignPlaceholder.deleteOne({
    _id: req.query.id,
  });
  return res.status(200).json(response);
};

module.exports = { getPlaceholders, deletePlaceholder, createPlaceholder };
