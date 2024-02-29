const FilterDesign = require("../models/FilterDesign");

const getFilters = async (req, res) => {
  const filters = await FilterDesign.find(
    req.query.author
      ? {
          author: { $in: ["", req.query.author] },
        }
      : {}
      // req.query.author
      // ? {
      //     author: { $in: [req.query.author] },
      //   }
      // : {}
  ).sort({
    updatedAt: -1,
  });
  return res.status(200).json(filters);
};

const createFilter = async (req, res) => {
  const filter = new FilterDesign({
    type: req.body.type,
    campaign: req.body.campaign_id,
    author: req.body.author,
    image: req.file.path,
  });

  try {
    const dataToSave = await filter.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};

const getFilter = async (req, res) => {
  const filter = await FilterDesign.findOne({ _id: req.query.id });
  return res.status(200).json(filter);
};

const deleteFilter = async (req, res) => {
  const response = await FilterDesign.deleteOne({ _id: req.query.id });
  return res.status(200).json(response);
};

module.exports = { getFilter, getFilters, createFilter, deleteFilter };
