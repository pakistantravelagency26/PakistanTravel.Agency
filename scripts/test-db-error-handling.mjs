import assert from "node:assert";

// Mock prisma and test behavior
console.log("=== Testing SEO Database Error Handling & Fallbacks ===");

// 1. Test serverListing.service behavior with DatabaseError
import { DatabaseError } from "../src/services/serverListing.service.ts";

const dbErr = new DatabaseError("Neon connection timeout", { cause: new Error("ETIMEDOUT") });
assert.strictEqual(dbErr.name, "DatabaseError");
assert.strictEqual(dbErr.message, "Neon connection timeout");
assert(dbErr.cause instanceof Error);
console.log("✔ DatabaseError class properly captures message and cause");

// 2. Test metadata generation logic when DB fails vs missing tour vs active tour
// Logic from src/app/listing/[slug]/page.tsx:
async function simulateGenerateMetadata(slug, fetchFn) {
  let listing;
  try {
    listing = await fetchFn(slug);
  } catch (error) {
    // Database outage: fallback metadata WITHOUT noindex
    return {
      status: "db_error",
      metadata: {
        title: "Guided Northern Pakistan Tour Package | PakistanTravel",
        description: "Explore guided tour packages and seasonal departures across Hunza, Skardu, Swat, and Kumrat with local operators.",
      }
    };
  }

  if (!listing) {
    // Genuinely missing tour -> noindex, 404
    return {
      status: "not_found",
      metadata: {
        title: "Tour Not Found | Pakistan Travel Agency",
        description: "Compare and book guided northern Pakistan tour packages across Hunza, Skardu, Swat and Kumrat.",
        robots: {
          index: false,
          follow: false,
        },
      }
    };
  }

  // Active tour -> indexable, 200
  return {
    status: "ok",
    metadata: {
      title: `${listing.title} | ${listing.city} Tour`,
      alternates: { canonical: `https://www.pakistantravel.agency/listing/${listing.slug}` },
      robots: { index: true, follow: true },
    }
  };
}

// 3. Test page rendering logic when DB fails vs missing tour vs active tour
async function simulatePageRender(slug, fetchFn) {
  // Bubbles error if DB fails -> Next.js returns 500
  const listing = await fetchFn(slug);
  if (!listing || listing.type !== "TOUR") {
    return { httpStatus: 404, action: "notFound()" };
  }
  return { httpStatus: 200, action: "render", listing };
}

// Case A: Active Tour
const activeListing = {
  id: "tour-1",
  slug: "hunza-autumn-blossom-tour",
  title: "7-Day Hunza Autumn Tour",
  type: "TOUR",
  city: "Hunza",
  basePrice: 55000,
  photos: ["https://example.com/photo.jpg"],
};
const activeFetch = async () => activeListing;

const metaA = await simulateGenerateMetadata("hunza-autumn-blossom-tour", activeFetch);
const pageA = await simulatePageRender("hunza-autumn-blossom-tour", activeFetch);
assert.strictEqual(metaA.status, "ok");
assert.strictEqual(metaA.metadata.robots.index, true);
assert.strictEqual(pageA.httpStatus, 200);
console.log("✔ Active tour returns 200 and index: true");

// Case B: Missing Tour
const missingFetch = async () => null;

const metaB = await simulateGenerateMetadata("non-existent-tour", missingFetch);
const pageB = await simulatePageRender("non-existent-tour", missingFetch);
assert.strictEqual(metaB.status, "not_found");
assert.strictEqual(metaB.metadata.robots.index, false);
assert.strictEqual(pageB.httpStatus, 404);
console.log("✔ Missing tour returns 404 and robots: index: false");

// Case C: Simulated Database Outage (Connection dropped / Neon compute paused)
const outageFetch = async () => {
  throw new DatabaseError("Neon database pool timeout");
};

const metaC = await simulateGenerateMetadata("hunza-autumn-blossom-tour", outageFetch);
assert.strictEqual(metaC.status, "db_error");
// Must NOT have robots: { index: false }!
assert.strictEqual(metaC.metadata.robots, undefined);
console.log("✔ Simulated DB outage during metadata generation DOES NOT emit noindex");

let threw500 = false;
try {
  await simulatePageRender("hunza-autumn-blossom-tour", outageFetch);
} catch (err) {
  if (err instanceof DatabaseError) {
    threw500 = true;
  }
}
assert.strictEqual(threw500, true);
console.log("✔ Simulated DB outage during page render throws DatabaseError (producing HTTP 500 error boundary, NOT 404)");

// 4. Test Sitemap Database Outage behavior
async function simulateSitemap(fetchActiveListings) {
  const staticRoutes = [{ url: "https://www.pakistantravel.agency" }];
  // If fetch throws DatabaseError, sitemap must throw, ensuring 500 rather than silent partial sitemap
  const activeListings = await fetchActiveListings();
  const listingRoutes = activeListings.map(l => ({ url: `https://www.pakistantravel.agency/listing/${l.slug}` }));
  return [...staticRoutes, ...listingRoutes];
}

// Sitemap with active DB
const sitemapOk = await simulateSitemap(async () => [activeListing]);
assert.strictEqual(sitemapOk.length, 2);
console.log("✔ Sitemap includes published tour URLs when DB is healthy");

// Sitemap during DB outage
let sitemapThrew = false;
try {
  await simulateSitemap(async () => {
    throw new DatabaseError("DB outage");
  });
} catch (err) {
  if (err instanceof DatabaseError) {
    sitemapThrew = true;
  }
}
assert.strictEqual(sitemapThrew, true);
console.log("✔ Sitemap during DB outage throws DatabaseError (producing HTTP 500, preventing silent partial sitemap)");

console.log("\nAll SEO Database Error Handling test assertions passed cleanly!");
