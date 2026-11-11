import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatDbListing } from "@/services/serverListing.service";
import { SITE_URL, siteConfig } from "@/config/site";
import { MapPin, Calendar, Compass, ChevronRight, HelpCircle, ShieldCheck } from "lucide-react";
import { CustomTripRequestForm } from "@/components/tours/CustomTripRequestForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  let count = 0;
  let dbFailed = false;
  try {
    count = await prisma.listing.count({
      where: {
        type: "TOUR",
        status: "PUBLISHED",
        
      },
    });
  } catch (err) {
    console.warn("Could not query tour count for metadata:", err);
    dbFailed = true;
  }

  // If DB query succeeded and genuinely 0 published tours exist, set noindex.
  // If DB query threw an error, do NOT deindex /tours due to a transient database outage!
  const isIndexable = dbFailed || count > 0;

  return {
    title: "Compare Northern Pakistan Tour Packages",
    description:
      "Compare guided northern Pakistan tour packages and scheduled departures across Hunza, Skardu, Swat, and Kumrat with direct verified operator bookings.",
    alternates: {
      canonical: `${SITE_URL}/tours`,
    },
    robots: {
      index: isIndexable,
      follow: true,
      googleBot: {
        index: isIndexable,
        follow: true,
      },
    },
    openGraph: {
      title: "Compare Northern Pakistan Tour Packages | PakistanTravel",
      description:
        "Compare guided northern Pakistan tour packages and scheduled departures across Hunza, Skardu, Swat, and Kumrat with direct verified operator bookings.",
      url: `${SITE_URL}/tours`,
      siteName: "PakistanTravel",
      locale: "en_PK",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Compare Northern Pakistan Tour Packages | PakistanTravel",
      description:
        "Compare guided northern Pakistan tour packages and scheduled departures across Hunza, Skardu, Swat, and Kumrat with direct verified operator bookings.",
    },
  };
}

const tourFaqs = [
  {
    q: "What is the best season to book northern Pakistan tour packages?",
    a: "The primary touring season runs from May through October when mountain passes including Babusar Top (4,173m) and Deosai Plains are snow-free and accessible. Spring (April–May) offers cherry and apricot blossoms across Hunza and Swat, summer (June–August) provides warm alpine trekking conditions, and autumn (September–November) features vibrant foliage across Gilgit-Baltistan.",
  },
  {
    q: "What inclusions are standard in guided northern tour packages?",
    a: "Standard guided packages typically include private or group highway transport (coasters or grand cabins), designated 4x4 mountain vehicles for steep terrain, dedicated local tour guides, night accommodation, and entry permits. Specific inclusions vary by operator and are detailed on each listing page.",
  },
  {
    q: "How are tour reservations and payments processed?",
    a: "Travelers can book through local payment methods including JazzCash, EasyPaisa, Pakistani bank transfers, or international credit and debit cards. Upon payment confirmation, a digital tour voucher is issued containing operator contact details and pickup logistics.",
  },
  {
    q: "What happens if road closures or weather delays affect a tour itinerary?",
    a: "Mountain itineraries in the Karakoram and Hindu Kush can occasionally encounter weather disruptions or road maintenance. Local operators adjust itineraries to alternative scenic routes or safe halting points. Cancellation and rescheduling terms are defined under each operator's cancellation policy.",
  },
  {
    q: "Can itineraries be customized for private families or specialized groups?",
    a: "Yes. In addition to scheduled group departures, travelers can submit a custom trip request with preferred dates, group size, and vehicle preferences to receive tailored proposals from local operators.",
  },
];

export default async function ToursPage() {
  let listings: any[] = [];
  try {
    const rawListings = await prisma.listing.findMany({
      where: {
        type: "TOUR",
        status: "PUBLISHED",
        
      },
      include: {
        vendor: true,
        destination: true,
        units: true,
        departures: { orderBy: { startDate: "asc" } },
        reviews: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    listings = rawListings.map(formatDbListing);
  } catch (err) {
    console.error("Failed to load tour listings:", err);
  }

  const destinationLinks = [
    { name: "Hunza Valley", slug: "hunza", subtitle: "Karimabad, Attabad Lake & Passu Cones" },
    { name: "Skardu & Baltistan", slug: "skardu", subtitle: "Shangrila, Deosai Plains & Shigar" },
    { name: "Swat Valley", slug: "swat", subtitle: "Mingora, Malam Jabba & Kalam" },
    { name: "Kumrat Valley", slug: "kumrat", subtitle: "Upper Dir Forest & Thal Meadows" },
    { name: "Neelum Valley", slug: "neelum", subtitle: "Keran, Sharda & Kel" },
    { name: "Murree & Galyat", slug: "murree", subtitle: "Mall Road, Nathia Gali & Ayubia" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: listings.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "TouristTrip",
        name: item.title,
        description: item.description,
        url: `${SITE_URL}/listing/${item.slug}`,
        image: item.photos[0],
        offers: {
          "@type": "Offer",
          price: item.basePrice,
          priceCurrency: "PKR",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tours",
        item: `${SITE_URL}/tours`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tourFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="min-h-screen bg-slate-50 pb-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-[#0A5C36] to-[#074729] text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
              <Link href="/" className="hover:underline">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>Tour Packages</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Northern Pakistan Tour Packages &amp; Guided Itineraries
            </h1>
            <p className="text-emerald-100 max-w-2xl text-sm sm:text-base leading-relaxed">
              Compare scheduled group departures and private custom itineraries operated directly by independent local tour operators across Gilgit-Baltistan and Khyber Pakhtunkhwa.
            </p>
          </div>
        </div>

        {/* Server-Rendered Factual Intro Text (200-300 words) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Planning Your Northern Pakistan Tour
            </h2>
            <p>
              Northern Pakistan is home to the world&apos;s most spectacular concentration of high mountain ranges, where the Karakoram, Himalaya, and Hindu Kush converge. Planning a guided tour across these northern valleys requires reliable local routing and experienced mountain navigation. Major touring corridors include the legendary Karakoram Highway (KKH), which winds past towering peaks and turquoise rivers toward the high-altitude valleys of Hunza, Nagar, and the China border at Khunjerab Pass. Further east, the rugged Baltistan region centers on Skardu, providing the principal access route to Shangrila Lake, the Shigar and Khaplu royal forts, and the vast, alpine tundra of Deosai National Park.
            </p>
            <p>
              To the northwest, Khyber Pakhtunkhwa&apos;s valleys offer contrasting alpine scenery. The Swat Valley and Kalam feature dense pine forests and glacial streams, easily accessible via the Swat Expressway. Adjacent lies the remote Kumrat Valley in Upper Dir, known for its pristine deodar woodlands and dramatic river meadows accessed through the Lowari Tunnel route.
            </p>
            <p>
              Guided tour packages on PakistanTravel are published and operated directly by independent local tour operators based within these northern communities. Packages generally bundle comfortable mountain transport (such as coasters for highway journeys and 4x4 vehicles for rugged interior tracks), licensed local guides, designated night stops, and trip permits. Whether you are seeking a multi-day family road journey, a cultural heritage itinerary through ancient forts, or an alpine expedition, comparing schedules from regional operators ensures transparent terms, direct booking vouchers, and genuine local knowledge on the ground.
            </p>
          </div>
        </section>

        {/* Destination Quick Navigation Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-700" />
            <span>Explore Tours by Destination</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {destinationLinks.map((dest) => (
              <Link
                key={dest.slug}
                href={`/tours?destination=${dest.slug}`}
                className="bg-white hover:bg-emerald-50/50 p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition text-center group shadow-sm flex flex-col justify-center"
              >
                <span className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 block">
                  {dest.name}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Browse tours →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Listings Grid or Empty State */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Compass className="w-6 h-6 text-[#0A5C36]" />
              <span>Available Tour Packages ({listings.length})</span>
            </h2>
          </div>

          {listings.length === 0 ? (
            <div className="space-y-10">
              <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 space-y-4 max-w-2xl mx-auto shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  New Seasonal Tour Departures Loading
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                  Independent tour operators are currently scheduling upcoming spring and summer departures. You can request a custom tailored departure using the form below.
                </p>
              </div>

              {/* Prominent Custom Trip Request Form when 0 listings */}
              <CustomTripRequestForm />
            </div>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((item) => (
                  <Link
                    key={item.id}
                    href={`/listing/${item.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={item.photos[0] || "/images/og/home-og.jpg"}
                        alt={`${item.title} guided tour in ${item.destinationName}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#0A5C36] shadow-sm flex items-center gap-1">
                        <span>{item.vendor?.businessName || "Local Operator"}</span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.destinationName}</span>
                          {item.duration && (
                            <>
                              <span>•</span>
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{item.duration}</span>
                            </>
                          )}
                        </div>
                        <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#0A5C36] transition line-clamp-2">
                          {item.title}
                        </h3>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">Starting From</span>
                          <div className="text-lg font-black text-slate-900">
                            PKR {item.basePrice.toLocaleString()}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#0A5C36] group-hover:underline">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Custom Trip Request Form below active listings */}
              <div className="pt-8">
                <CustomTripRequestForm />
              </div>
            </div>
          )}
        </section>

        {/* Tour FAQs Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Common Questions</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Frequently Asked Questions About Northern Tours
            </h2>
          </div>

          <div className="space-y-3">
            {tourFaqs.map((faq, idx) => (
              <details
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 group open:ring-1 open:ring-emerald-500/20 shadow-sm"
              >
                <summary className="font-extrabold text-sm text-slate-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{faq.q}</span>
                  <span className="text-emerald-600 font-bold ml-2 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
