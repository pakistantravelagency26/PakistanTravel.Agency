import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/secure-admin/",
          "/partner-hub/",
          "/api/",
          "/checkout/",
          "/account/",
          "/confirmation/",
        ],
      },
    ],
    sitemap: "https://pakistan-travel-agency.vercel.app/sitemap.xml",
  };
}
