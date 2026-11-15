import type { Metadata, Viewport } from "next";
import "@/lib/env";
import "./globals.css";
import dynamic from "next/dynamic";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { siteConfig, SITE_URL } from "@/config/site";

const SupportChatWidget = dynamic(
  () => import("@/components/chat/SupportChatWidget"),
  { ssr: false }
);

const CookieConsentBanner = dynamic(
  () => import("@/components/analytics/CookieConsentBanner"),
  { ssr: false }
);

const siteUrl = SITE_URL;

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Northern Pakistan Tour Packages | PakistanTravel",
    template: "%s | PakistanTravel",
  },
  authors: [{ name: "PakistanTravel", url: siteUrl }],
  creator: "PakistanTravel",
  publisher: "PakistanTravel",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: "PakistanTravel",
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
  verification: {
    google: "_dtqzGPHubzFRP1O4KBy3bcZjIlfrRoz-DtaGPx44ww",
    other: {
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION }
        : {}),
    },
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
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "PakistanTravel",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          "@id": `${siteUrl}/#logo`,
          url: `${siteUrl}/favicon.png`,
          caption: "PakistanTravel",
        },
        email: siteConfig.contact.supportEmail || "support@pakistantravel.agency",
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteConfig.name,
        inLanguage: "en-PK",
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/tours?q={search_term_string}`,
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
        <meta name="google-site-verification" content="_dtqzGPHubzFRP1O4KBy3bcZjIlfrRoz-DtaGPx44ww" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredDataGraph).replace(/</g, "\\u003c"),
          }}
        />
        {/* Google Consent Mode v2 Default (EU/UK privacy compliant, defaults to denied) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'wait_for_update': 500
});
try {
  var savedConsent = localStorage.getItem('cookie_consent_analytics');
  if (savedConsent === 'granted') {
    gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
  }
} catch (e) {}
gtag('js', new Date());`,
          }}
        />
        {/* Google Tag Manager - Loaded on Interaction / Idle for Core Web Vitals Optimization */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){
  w[l]=w[l]||[];
  var loaded=false;
  function loadGTM(){
    if(loaded)return;
    loaded=true;
    w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],j=d.createElement(s);
    j.async=true;
    j.src='https://www.googletagmanager.com/gtm.js?id='+i+(l!='dataLayer'?'&l='+l:'');
    f.parentNode.insertBefore(j,f);
    window.removeEventListener('scroll',loadGTM);
    window.removeEventListener('pointerdown',loadGTM);
    window.removeEventListener('touchstart',loadGTM);
  }
  if('requestIdleCallback' in window){
    requestIdleCallback(function(){setTimeout(loadGTM,1500);});
  }else{
    setTimeout(loadGTM,2500);
  }
  window.addEventListener('scroll',loadGTM,{passive:true,once:true});
  window.addEventListener('pointerdown',loadGTM,{passive:true,once:true});
  window.addEventListener('touchstart',loadGTM,{passive:true,once:true});
})(window,document,'script','dataLayer','GTM-PRQQWCK8');`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 antialiased selection:bg-brand-emerald selection:text-white">
        {/* Google Tag Manager noscript fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PRQQWCK8"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <SupportChatWidget />
          <CookieConsentBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
