import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";

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
    default: "Pakistan Travel Agency | Verified Tours & Hotels in Pakistan",
    template: "%s | PakistanTravel.Agency",
  },
  description: "Book verified northern Pakistan tour packages, luxury mountain hotels, and 4x4 rentals across Hunza, Skardu, and Swat with instant confirmation vouchers.",
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
    title: "Pakistan Travel Agency | Verified Tours & Hotels in Pakistan",
    description: "Book verified northern Pakistan tour packages, luxury mountain hotels, and 4x4 rentals across Hunza, Skardu, and Swat with instant confirmation vouchers.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
        width: 1200,
        height: 630,
        alt: "Pakistan Travel Agency Northern Tourism Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pakistan Travel Agency | Verified Tours & Hotels in Pakistan",
    description: "Book verified northern Pakistan tour packages, luxury mountain hotels, and 4x4 rentals across Hunza, Skardu, and Swat with instant confirmation vouchers.",
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
  const structuredDataGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": `${siteUrl}/#organization`,
        name: "PakistanTravel.Agency",
        url: siteUrl,
        logo: `${siteUrl}/favicon.png`,
        description: "Official booking marketplace for Pakistan tourism offering verified northern tours, mountain hotels, and 4x4 rentals.",
        telephone: "+923222327096",
        address: {
          "@type": "PostalAddress",
          addressCountry: "PK",
          addressRegion: "Islamabad Capital Territory",
          addressLocality: "Islamabad",
        },
        currenciesAccepted: "PKR",
        paymentAccepted: "JazzCash, EasyPaisa, Debit Card, Credit Card, Cash on Arrival",
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "PakistanTravel.Agency",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        inLanguage: ["en-PK", "ur-PK"],
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
        ],
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataGraph) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 antialiased selection:bg-brand-emerald selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
