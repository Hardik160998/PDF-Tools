import { trackEvent as gtagTrackEvent } from "@/components/GoogleAnalytics";

export const trackPdfToolUsage = (toolName: string, action: string = "use") => {
  gtagTrackEvent("pdf_tool_interaction", {
    tool_name: toolName,
    interaction_type: action,
    category: "pdf_tools",
  });
};

export const trackUploadClick = () => {
  gtagTrackEvent("upload_click", {
    category: "engagement",
  });
};

export const trackPremiumClick = () => {
  gtagTrackEvent("premium_plan_click", {
    category: "conversion",
    value: 1,
  });
};

export const trackEcommerceCropperUsage = (platform: string) => {
  gtagTrackEvent("ecommerce_cropper_interaction", {
    platform: platform,
    category: "ecommerce_tools",
  });
};

export const trackEvent = gtagTrackEvent;