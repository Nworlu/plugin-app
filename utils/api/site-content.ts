import { apiClient } from "@/utils/api-client";
import type { SiteContent } from "./types";

export const siteContentApi = {
  /** Get landing page content, footer links, etc. */
  get: () => apiClient.get<SiteContent>("site-content/"),
};
