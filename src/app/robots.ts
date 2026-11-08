import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pakistantravel-agency.vercel.app";

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
          "/*?destination=*",
          "/*?type=*",
          "/*?date=*",
          "/*?q=*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
