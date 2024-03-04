import { OptionType } from "./types";

export const campaignCategories: OptionType[] = [
    { value: "event", label: "Event / Conference" },
    { value: "marketing", label: "Marketing Campaign" },
    { value: "sports", label: "Sports Club" },
    { value: "hr", label: "HR / Employer Branding" },
    { value: "ngo", label: "NGO / Donation" },
    { value: "other", label: "Other" },
];

export const filterDesignWidths = {
    square: "max-w-[350px]",
    story: "max-w-[290px]",
    custom: "max-w-[700px]",
};

export const sizeTypes: any = {
    "1080x1080": "square",
    "1080x1920": "story",
};