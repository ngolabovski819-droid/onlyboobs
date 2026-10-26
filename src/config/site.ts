export const contactEmailPlaceholder = "contact@onlyboobs.co";

export const site = {
  name: "OnlyBoobs",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://onlyboobs.co",
  description:
    "Discover OnlyFans creators of all breast sizes and shapes. Browse worldwide profiles by category and subscription price.",
  contactEmail: process.env.CONTACT_EMAIL?.trim() ?? "",
  promoteUrl: process.env.PROMOTE_FORM_URL || "https://tally.so/r/kd16Xe",
  launchReady: process.env.SITE_LAUNCH_READY === "true",
};
