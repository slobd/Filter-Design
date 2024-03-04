import { OptionType } from "./types";

export const campaignCategories: OptionType[] = [
    { value: "event", label: "Event / Conference" },
    { value: "marketing", label: "Marketing Campaign" },
    { value: "sports", label: "Sports Club" },
    { value: "hr", label: "HR / Employer Branding" },
    { value: "ngo", label: "NGO / Donation" },
    { value: "other", label: "Other" },
];

export const filterDesignWidths: { [key: string]: string } = {
    square: "max-w-[350px]",
    story: "max-w-[290px]",
    custom: "max-w-[700px]",
};

export const sizeTypes: any = {
    "1080x1080": "square",
    "1080x1920": "story",
};

export const textTypeDefaultValue = {
    text: "",
    font_family: "Inter",
    font_weight: 400,
    font_size: 14,
    line_height: 21,
    color: "",
    letter_spacing: 0,
    padding_top: 0,
    padding_bottom: 0,
};

export const logoTypeDefaultValue = {
    size: 80,
    radius: 0,
    padding_top: 0,
    padding_bottom: 0,
};