export type BasicPropType = {
  children: React.ReactNode;
  className?: string;
};

export type OptionType = {
  value: string | null,
  label: string | null,
}

export type ColumnType = {
  id: string | null,
  label: string | null,
  align?: string | null,
}

export type ButtonType = {
  text?: string | null,
  bgcolor?: string | null,
  textcolor?: string | null,
  icon?: string | null,
}

export type RndType = {
  x: number | undefined,
  y: number | undefined,
  w: number | undefined,
  h: number | undefined,
}

export type FilterType = {
  filter_design: FilterDesignType | undefined,
  button: ButtonType | undefined,
  rnd: RndType | undefined,
}

export type sharingOptionType = {
  twitter?: boolean | null | undefined,
  linkedin?: boolean | null | undefined,
  whatsapp?: boolean | null | undefined,
  facebook?: boolean | null | undefined,
  download?: boolean | null | undefined,
  email?: boolean | null | undefined,
}

export type BackgroundType = {
  type: string | null,
  value: string | null,
}

export type TextType = {
  text?: string | null | undefined,
  font_family?: string | null | undefined,
  font_weight?: number | null | undefined,
  font_size?: number | null | undefined,
  line_height?: number | null | undefined,
  color?: string | null | undefined,
  letter_spacing?: number | null | undefined,
  padding_top?: number | null | undefined,
  padding_bottom?: number | null | undefined,
};

export type LogoType = {
  size?: number | null | undefined,
  radius?: number | null | undefined,
  padding_top?: number | null | undefined,
  padding_bottom?: number | null | undefined,
}

export type CampaignType = {
  _id?: number,
  name?: string | null,
  slug?: string | null,
  title?: TextType | undefined,
  description?: TextType | undefined,
  logo?: string | null,
  logo_setting?: LogoType | undefined,
  filters?: FilterType[] | [],
  active_slider_mode?: boolean | null,
  hide_size_buttons?: boolean | null,
  dark_mode?: boolean | null,
  activate_filters?: boolean | null,
  password?: string | null,
  edge?: number | null,
  share_title?: string | null,
  share_text?: string | null,
  notification_title?: string | null,
  notification_text?: string | null,
  sharing_options?: sharingOptionType | undefined,
  show_gallery?: boolean | null,
  placeholder_image?: string | null,
  placeholder_story_image?: string | null,
  views?: number | null,
  uses?: number | null,
  conversion_rate?: number | null,
  invitations?: number | null,
  status?: string | null,
  author?: string | null,
  change_photo?: string | null,
  download_image?: TextType | undefined,
  download_share?: string | null,
  category?: string | null,
  start_date?: string | null,
  location?: string | null,
  event_name?: string | null,
  background?: BackgroundType | undefined,
  imprint_link?: string | null,
  data_privacy_link?: string | null,
  updatedAt?: string | null,
}

export type ContactType = {
  _id?: number | null,
  email: string | null,
  first_name: string | null,
  last_name: string | null,
  position: string | null,
  linkedin: string | null,
  logo: string | null,
  company_name: string | null,
  company_logo: string | null,
  tags: string[] | [],
  author: string | null,
}

export type FilterDesignType = {
  _id?: number | null,
  image: string | null,
  campaign: string | null,
  type: string | null,
  author: string | null,
}

export type FilterDesignPlaceholderType = {
  _id?: number | null,
  image: string | null,
  author: string | null,
  type: string | null,
}

export type GalleryType = {
  _id?: number | null,
  campaign: string | null,
  filter_design?: string | null,
  path: string | null,
  updatedAt?: string,
}

export type TagType = {
  _id?: number | null,
  name: string | null,
}

export type UniqueLinkType = {
  _id?: number | null,
  campaign: string | null,
  contact: string | null,
  link: string | null,
  uses: number | null,
  blocked: boolean | null,
}

export type PlaceholderType = {
  _id?: number | null,
  image: string | null,
  author: string | null,
  type: string | null,
}