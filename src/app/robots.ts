import type { MetadataRoute } from "next";
import { SITE_URL } from "../config/site.ts";

const baseUrl = SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/search",
          "/login",
          "/register",
          "/checkout/",
          "/account/",
          "/confirmation/",
          "/dashboard/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
