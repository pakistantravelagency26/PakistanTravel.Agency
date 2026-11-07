import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pakistan-travel-agency.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/login",
          "/register",
          "/dashboard",
          "/admin",
          "/secure-admin/",
          "/partner-hub/",
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
