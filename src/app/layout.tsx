import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pakistan-travel-agency.vercel.app";

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PakistanTravel.Agency | Verified Tours & Luxury Hotels in Pakistan",
    template: "%s | PakistanTravel.Agency",
  },
  description: "Official booking marketplace for Pakistan tourism. Book verified northern tours in Hunza, Skardu, Kumrat & Swat, luxury mountain hotels, 4x4 rentals, and adventure treks with instant voucher confirmation.",
  keywords: [
    "Pakistan travel agency",
    "Hunza tour packages",
    "Skardu tour packages",
    "Kumrat valley tours",
    "Kalam Swat hotels",
    "Deosai plains expedition",
    "Pakistan hotels booking",
    "4x4 northern areas rental",
    "JazzCash travel booking",
  ],
  authors: [{ name: "PakistanTravel.Agency", url: siteUrl }],
  creator: "PakistanTravel.Agency",
  publisher: "PakistanTravel.Agency",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteUrl,
    siteName: "PakistanTravel.Agency",
    title: "PakistanTravel.Agency | Verified Tours & Luxury Hotels in Pakistan",
    description: "Book verified northern tours, luxury hotels in Hunza & Skardu, and 4x4 mountain rentals across Pakistan with guaranteed instant confirmation.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
        width: 1200,
        height: 630,
        alt: "PakistanTravel.Agency Northern Tourism Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PakistanTravel.Agency | Verified Tours & Luxury Hotels",
    description: "Book verified northern tours in Hunza, Skardu, Swat, and Kumrat with instant confirmation.",
    images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "PakistanTravel.Agency",
    url: siteUrl,
    logo: `${siteUrl}/favicon.png`,
    description: "Pakistan's premier multi-vendor travel booking platform for northern tours, mountain hotels, and 4x4 rentals.",
    telephone: "+923000000000",
    address: {
      "@type": "PostalAddress",
      addressCountry: "PK",
      addressRegion: "Islamabad Capital Territory",
      addressLocality: "Islamabad",
    },
    currenciesAccepted: "PKR",
    paymentAccepted: "JazzCash, EasyPaisa, Debit Card, Credit Card, Cash on Arrival",
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 antialiased selection:bg-brand-emerald selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
