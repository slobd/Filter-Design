const bcrypt = require("bcrypt");
const Campaign = require("../models/Campaign");
const Gallery = require("../models/Gallery");
const UniqueLink = require("../models/UniqueLink");
const FilterDesign = require("../models/FilterDesign");
const fs = require('fs');

const saltRounds = 10;

const createCampaign = async (req, res) => {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(req.body.password, salt, async (err, hash) => {
      const campaign = new Campaign({
        name: req.body.name,
        slug: req.body.slug,
        title: req.body.title,
        description: req.body.description,
        filters: req.body.filters,
        logo: req.file?.path || null,
        logo_setting: req.body.logo_setting,
        dark_mode: req.body.dark_mode,
        activate_filters: req.body.activate_filters,
        password: hash,
        sharing_options: req.body.sharing_options,
        show_gallery: req.body.show_gallery,
        placeholder_image: req.body.placeholder_image,
        placeholder_story_image: req.body.placeholder_story_image,
        views: req.body.views,
        uses: req.body.uses,
        conversion_rate: req.body.conversion_rate,
        invitations: req.body.invitations,
        status: req.body.status,
        edge: req.body.edge,
        share_title: req.body.share_title,
        share_text: req.body.share_text,
        copy_text: req.body.copy_text,
        square_text: req.body.square_text,
        story_text: req.body.story_text,
        notification_title: req.body.notification_title,
        notification_text: req.body.notification_text,
        author: req.body.author,
        category: req.body.category,
        start_date: req.body.start_date,
        location: req.body.location,
        event_name: req.body.event_name,
        change_photo: req.body.change_photo,
        download_image: req.body.download_image,
        download_share: req.body.download_share,
        background: req.body.background,
        imprint_link: req.body.imprint_link,
        data_privacy_link: req.body.data_privacy_link,
      });
      try {
        const dataToSave = await campaign.save();
        res.status(200).json(dataToSave);
      } catch (error) {
        res.status(200).json({ message: error.message });
      }
    });
  });
};

const editCampaign = async (req, res) => {
  const campaign = await Campaign.findOne({ _id: req.body._id });
  if(campaign.author != req.body.author) res.status(403).json({ message: "No permission!!!" });
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(req.body.password, salt, async (err, hash) => {
      campaign.name = req.body.name;
      campaign.slug = req.body.slug;
      campaign.title = req.body.title;
      campaign.description = req.body.description;
      campaign.filters = req.body.filters;
      campaign.logo = req.body.logo || req.file?.path;
      campaign.logo_setting = req.body.logo_setting;
      campaign.dark_mode = req.body.dark_mode;
      if (campaign.password !== req.body.password && req.body.password) {
        campaign.password = hash;
      }
      campaign.sharing_options = req.body.sharing_options;
      campaign.show_gallery = req.body.show_gallery;
      campaign.placeholder_image = req.body.placeholder_image;
      campaign.placeholder_story_image = req.body.placeholder_story_image;
      campaign.views = req.body.views;
      campaign.uses = req.body.uses;
      campaign.conversion_rate = req.body.conversion_rate;
      campaign.invitations = req.body.invitations;
      campaign.status = req.body.status;
      campaign.edge = req.body.edge ?? 14;
      campaign.share_title = req.body.share_title;
      campaign.share_text = req.body.share_text;
      campaign.copy_text = req.body.copy_text;
      campaign.square_text = req.body.square_text;
      campaign.story_text = req.body.story_text;
      campaign.notification_title = req.body.notification_title;
      campaign.notification_text = req.body.notification_text;
      campaign.author = req.body.author;
      campaign.category = req.body.category;
      campaign.start_date = req.body.start_date;
      campaign.location = req.body.location;
      campaign.event_name = req.body.event_name;
      campaign.change_photo = req.body.change_photo;
      campaign.download_image = req.body.download_image;
      campaign.download_share = req.body.download_share;
      campaign.background = req.body.background;
      campaign.imprint_link = req.body.imprint_link;
      campaign.data_privacy_link = req.body.data_privacy_link;
      campaign.active_slider_mode = req.body.active_slider_mode;
      campaign.hide_size_buttons = req.body.hide_size_buttons;
      campaign.activate_filters = req.body.activate_filters;
      try {
        const dataToSave = await campaign.save();
        const _campaign = await Campaign.findOne({ _id: req.body._id }).populate(
          "filters.filter_design"
        );
        res.status(200).json(_campaign);
      } catch (error) {
        res.status(200).json({ message: error.message });
      }
    });
  });
};

const deleteCampaign = async (req, res) => {
  const _campaign = await Campaign.findOne({ _id: req.query.id })
  if(req.query.email != _campaign.author) return;
  const response = await Campaign.findOneAndDelete({ _id: req.query.id });
  await UniqueLink.deleteMany({ campaign: response._id });
  const galleries = await Gallery.find({campaign: req.query.id});
  galleries.map(i => {
    let path = i.path;
    fs.unlink(path, async () => {
      console.log("deleted:", i.path);
    });
  })
  await Gallery.deleteMany({ campaign: response._id });
  
  return res.status(200).json(response);
};

const getCampaign = async (req, res) => {
  const query = req.query.id ? { _id: req.query.id } : { slug: req.query.slug };
  const campaign = await Campaign.findOne(query).populate(
    "filters.filter_design"
  );
  return res.status(200).json(campaign);
};

const getCampaigns = async (req, res) => {
  const campaigns = await Campaign.find({ author: req.query.author })
    .sort({
      updatedAt: -1,
    })
    .populate("filters.filter_design");
  return res.status(200).json(campaigns);
};

const confirmPassword = async (req, res) => {
  const { slug, password } = req.query;
  const campaign = await Campaign.findOne({ slug: slug });
  bcrypt.compare(password, campaign.password, (err, result) => {
    return res.status(200).json({ status: result });
  });
};

const inviteByEmail = async (req, res) => {
  const msg = {
    to: req.body.email,
    from: "meinehannes@gmail.com",
    subject: "Shared a Campaign",
    html: `<p>dummy text content....</p><a href="${res.body?.link}">${res.body?.link}</a>`,
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

const getReporting = async (req, res) => {
  const campaign = await Campaign.findOne({ slug: req.query.slug });
  if(campaign) {
    const galleries = await Gallery.find({
      campaign: campaign?._id,
      createdAt: {
        $gte: new Date(req.query.startDate),
        $lt: new Date(req.query.endDate),
      },
    })
      .populate("campaign")
      .populate("filter_design")
      .sort({
        updatedAt: -1,
      });
    return res.status(200).json({
      views: campaign.views,
      uses: campaign.uses,
      downloads: 0,
      conversationRate: 0,
      galleries,
    });
  }
};

module.exports = {
  confirmPassword,
  createCampaign,
  deleteCampaign,
  editCampaign,
  getCampaign,
  getCampaigns,
  getReporting,
  inviteByEmail,
};
