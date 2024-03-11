const fs = require("fs");
const Campaign = require("../models/Campaign");
const Gallery = require("../models/Gallery");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const getGalleries = async (req, res) => {
  const { id, author } = req.query;
  if (id) {
    const galleries = await Gallery.find({ campaign: id })
      .populate("campaign")
      .populate("filter_design")
      .sort({
        updatedAt: -1,
      });
    return res.status(200).json(galleries);
  } else {
    const campaigns = await Campaign.find({ author });
    const galleries = await Gallery.find({
      campaign: { $in: campaigns.map((campaign) => campaign._id) },
    })
      .populate("campaign")
      .populate("filter_design")
      .sort({ updatedAt: -1 });
    return res.status(200).json(galleries);
  }
};

const createGallery = async (req, res) => {
  const gallery = new Gallery({
    campaign: req.body.campaign_id,
    filter_design: req.body.filter_design_id,
    author: req.body.author,
    path: req.file.path,
  });
  const campaign = await Campaign.findOne({ _id: req.body.campaign_id });
  campaign.uses++;
  try {
    const dataToSave = await gallery.save();
    await campaign.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};

const deleteGallery = async (req, res) => {
  const gallery = await Gallery.findOne({ _id: req.query.id });
  if(gallery.author != req.query.email) return;
  const path = `${appRootRir}/${gallery.path}`;
  fs.unlink(path, async () => {
    const response = await Gallery.deleteOne({ _id: req.query.id });
    return res.status(200).json(response);
  });
};

const sendGalleryByEmail = async (req, res) => {
  const msg = {
    to: req.body.email,
    from: "meinehannes@gmail.com",
    subject: "Gallery",
    html: `<img src='${req.body.gallery}' />`,
  };

  sgMail.send(msg).then(
    (res) => {
      console.log(res);
    },
    (error) => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  );
};

module.exports = {
  getGalleries,
  createGallery,
  deleteGallery,
  sendGalleryByEmail,
};
