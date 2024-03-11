const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const buttonSchema = Schema({
  text: { type: String, require: true },
  bgcolor: { type: String, require: true },
  textcolor: { type: String, require: true },
  icon: { type: String, require: true },
});

const rndSchema = Schema({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  w: { type: Number, default: 100 },
  h: { type: Number, default: 100 },
});

const filterSchema = Schema({
  filter_design: { type: Schema.Types.ObjectId, ref: "FilterDesign" },
  button: { type: buttonSchema, require: true },
  rnd: { type: rndSchema, requied: true },
});

const sharingOptionSchema = Schema({
  twitter: { type: Boolean, default: true },
  linkedin: { type: Boolean, default: true },
  whatsapp: { type: Boolean, default: true },
  facebook: { type: Boolean, default: true },
  download: { type: Boolean, default: true },
  email: { type: Boolean, default: true },
});

const backgroundSchema = Schema({
  type: { type: String, enum: ["image", "color"] },
  value: { type: String },
});

const textSchema = Schema({
  icon: { type: String},
  text: { type: String },
  font_family: { type: String },
  font_weight: { type: Number },
  font_size: { type: Number },
  line_height: { type: Number },
  color: { type: String },
  padding_top: { type: Number },
  padding_bottom: { type: Number },
  letter_spacing: { type: Number },
});

const logoSchema = Schema({
  size: { type: Number },
  radius: { type: Number },
  padding_top: { type: Number },
  padding_bottom: { type: Number },
});

const campaignSchema = Schema(
  {
    name: { type: String, default: "My Filter Campaign #1" },
    slug: { type: String, required: true },
    title: {
      type: textSchema,
      default: {
        icon: "",
        text: "Share your Photo with your Network and Friends",
        font_family: "inherit",
        font_weight: 700,
        font_size: 30,
        line_height: 45,
        color: "#000",
        padding_top: 0,
        padding_bottom: 20,
        letter_spacing: 0,
      },
    },
    description: {
      type: textSchema,
      default: {
        icon: "",
        text: "It’s easy! Just upload a photo and get a visual filter to share with your network and friends.",
        font_family: "inherit",
        font_weight: 400,
        font_size: 14,
        line_height: 21,
        color: "#000",
        padding_top: 0,
        padding_bottom: 20,
        letter_spacing: 0,
      },
    },
    logo: { type: "String" },
    logo_setting: {
      type: logoSchema,
      default: {
        size: 80,
        radius: 0,
        padding_top: 0,
        padding_bottom: 20,
      },
    },
    filters: { type: [filterSchema], require: true },
    active_slider_mode: {type: Boolean, default: false},
    hide_size_buttons: {type: Boolean, default: false},
    dark_mode: { type: Boolean, default: false },
    activate_filters: { type: Boolean, default: false},
    password: { type: String },
    edge: { type: Number, default: 14 },
    share_title: { type: String, default: "" },
    share_text: { type: String, default: "" },
    notification_title: { type: String, default: "Download Success" },
    notification_text: { type: String, default: "You have successfully downloaded the image." },
    sharing_options: {
      type: sharingOptionSchema,
      default: {
        twitter: false,
        linkedin: false,
        whatsapp: false,
        facebook: false,
        download: true,
        email: false,
      },
    },
    show_gallery: { type: Boolean, default: false },
    placeholder_image: { type: String },
    placeholder_story_image: {type: String },
    views: { type: Number, required: true, default: 0 },
    uses: { type: Number, required: true, default: 0 },
    conversion_rate: { type: Number },
    invitations: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    author: { type: String, required: true },
    change_photo: { type: String, default: "Change Photo" },
    download_image: {
      type: textSchema,
      default: {
        icon: "",
        text: "Download Photo",
        font_family: "inherit",
        font_weight: 500,
        font_size: 16,
        line_height: 24,
        color: "#FFF",
        padding_top: 0,
        padding_bottom: 20,
        letter_spacing: 0,
      },
    },
    download_share: { type: String, default: "Download and Share!" },
    category: { type: String, default: "event" },
    start_date: { type: String },
    location: { type: String },
    event_name: { type: String },
    background: {
      type: backgroundSchema,
      default: {
        type: "color",
        value: "#f3f4f6",
      },
    },
    imprint_link: {type: String, default: "https://livedab.com/imprint"},
    data_privacy_link: {type: String, default: "https://livedab.com/privacy"},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Campaign", campaignSchema);
