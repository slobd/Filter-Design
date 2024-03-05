const Campaign = require("../models/Campaign");
const Contact = require("../models/Contact");
const UniqueLink = require("../models/UniqueLink");

const getUniqueLinks = async (req, res) => {
  const campaign = await Campaign.findOne({ slug: req.query.campaign });
  const links = await UniqueLink.find({
    campaign: campaign?._id,
  })
    .populate("campaign")
    .populate("contact");
  return res.status(200).json(links);
};

const createUniqueLinks = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.body.campaign });
    const author = campaign?.author;
    const contacts = await Contact.find({ author });

    for (let contact of contacts) {
      let uniqueLink = await UniqueLink.create({
        campaign: req.body.campaign,
        contact: contact?._id,
        link: new Date().getTime().toString(),
      });
      await uniqueLink.save();
    }
    res.status(200).json("success");
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};

module.exports = {
  getUniqueLinks,
  createUniqueLinks,
};
