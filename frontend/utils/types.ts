export type OptionType = {
  value: string | null,
  label: string | null,
}

export type buttonType = {
  text: string | null,
  bgcolor: string | null,
  textcolor: string | null,
  icon: string | null,
}

export type rndType = {
  x: number | null,
  y: number | null,
  w: number | null,
  h: number | null,
}

export type filterType = {
  filter_design: FilterDesignType | undefined,
  button: buttonType | undefined,
  rnd: rndType | undefined,
}

export type sharingOptionType = {
  twitter: boolean | null,
  linkedin: boolean | null,
  whatsapp: boolean | null,
  facebook: boolean | null,
  download: boolean | null,
  email: boolean | null,
}

export type backgroundType = {
  type: string | null,
  value: string | null,
}

export type textType = {
  text: string | null,
  font_family: string | null,
  font_weight: number | null,
  font_size: number | null,
  line_height: number | null,
  color: string | null,
  padding_top: number | null,
  padding_bottom: number | null,
  letter_spacing: number | null,
};

export type logoType = {
  size: number | null,
  radius: number | null,
  padding_top: number | null,
  padding_bottom: number | null,
}

export type CampaignType = {
  _id: number | null,
  name: string | null,
  slug: string | null,
  title: textType | undefined,
  description: textType | undefined,
  logo: string | null,
  logo_setting: logoType | undefined,
  filters: [filterType] | [],
  active_slider_mode: boolean | null,
  hide_size_buttons: boolean | null,
  dark_mode: boolean | null,
  password: string | null,
  edge: number | null,
  share_title: string | null,
  share_text: string | null,
  sharing_options: sharingOptionType | undefined,
  show_gallery: boolean | null,
  placeholder_image: string | null,
  placeholder_story_image: string | null,
  views: number | null,
  uses: number | null,
  conversion_rate: number | null,
  invitations: number | null,
  status: string | null,
  author: string | null,
  change_photo: string | null,
  download_image: string | null,
  download_share: string | null,
  category: string | null,
  start_date: string | null,
  location: string | null,
  event_name: string | null,
  background: backgroundType | undefined,
  imprint_link: string | null,
  data_privacy_link: string | null,
}

export type contactType = {
  _id: number | null,
  email: string | null,
  first_name: string | null,
  last_name: string | null,
  position: string | null,
  linkedin: string | null,
  logo: string | null,
  company_name: string | null,
  company_logo: string | null,
  tags: [string] | [],
  author: string | null,
}

export type FilterDesignType = {
  _id: number | null,
  image: string | null,
  campaign: string | null,
  type: string | null,
  author: string | null,
}

export type filterDesignPlaceholderType = {
  _id: number | null,
  image: string | null,
  author: string | null,
  type: string | null,
}

export type galleryType = {
  _id: number | null,
  campaign: string | null,
  path: string | null,
}

export type tagType = {
  _id: number | null,
  name: string | null,
}

export type uniqueLinkType = {
  _id: number | null,
  campaign: string | null,
  contact: string | null,
  link: string | null,
  uses: number | null,
  blocked: boolean | null,
}