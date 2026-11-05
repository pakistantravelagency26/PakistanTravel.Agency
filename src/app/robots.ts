import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/vendor/", "/account/", "/checkout/"],
      },
    ],
    sitemap: "https://pakistantravel.agency/sitemap.xml",
  };
}
