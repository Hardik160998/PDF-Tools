"use client";

import { useCallback } from "react";
import { trackEvent, trackPdfToolUsage, trackUploadClick, trackPremiumClick, trackEcommerceCropperUsage } from "@/lib/analytics";

export function useAnalytics() {
  const trackToolUsage = useCallback((toolName: string) => {
    trackPdfToolUsage(toolName);
  }, []);

  const trackUpload = useCallback(() => {
    trackUploadClick();
  }, []);

  const trackPremium = useCallback(() => {
    trackPremiumClick();
  }, []);

  const trackCropper = useCallback((platform: string) => {
    trackEcommerceCropperUsage(platform);
  }, []);

  const trackCustomEvent = useCallback((action: string, params?: Record<string, unknown>) => {
    trackEvent(action, params);
  }, []);

  return {
    trackToolUsage,
    trackUpload,
    trackPremium,
    trackCropper,
    trackCustomEvent,
  };
}