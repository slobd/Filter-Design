const Tag = require("../models/Tag");

const getTags = async (req, res) => {
  const tags = await Tag.find({});
  return res.status(200).json(tags);
};

const createTag = async (req, res) => {
  const tag = new Tag({
    name: req.body.name,
  });

  try {
    const dataToSave = await tag.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};

const deleteTag = async (req, res) => {
  const response = await Tag.deleteOne({
    _id: req.query.id,
  });
  return res.status(200).json(response);
};

module.exports = { getTags, deleteTag, createTag };
