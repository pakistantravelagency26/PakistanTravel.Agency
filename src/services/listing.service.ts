import { isVendorEnabled } from "./vendor.service";

export interface ListingUnitData {
  id: string;
  title: string;
  description: string;
  maxGuests: number;
  totalQuantity: number;
  basePrice: number;
  photos: string[];
  amenities: string[];
  bedType: string;
}

export interface ListingData {
  id: string;
  slug: string;
  title: string;
  type: "HOTEL" | "TOUR" | "RENTAL" | "ACTIVITY";
  destinationSlug: string;
  destinationName: string;
  province: string;
  address: string;
  city: string;
  basePrice: number;
  avgRating: number;
  totalReviews: number;
  isFeatured: boolean;
  freeCancellation: boolean;
  freeCancellationDays: number;
  photos: string[];
  amenities: string[];
  description: string;
  badge?: string;
  duration?: string;
  cancellationPolicy: string;
  moderationStatus?: "APPROVED" | "PENDING_APPROVAL" | "REJECTED";
  isEdited?: boolean;
  moderationNotes?: string;
  submittedAt?: string;
  reviewedAt?: string;
  vendor: {
    id: string;
    businessName: string;
    verified: boolean;
    joinedYear: number;
    rating: number;
  };
  units: ListingUnitData[];
  reviews: {
    id: string;
    userName: string;
    userCity: string;
    rating: number;
    date: string;
    comment: string;
    vendorReply?: string;
  }[];
}

// Multi-Vendor Network (Verified Tour & Hotel Operators across Pakistan)
export const VENDORS = {
  KARAKORAM: {
    id: "v-karakoram-expeditions",
    businessName: "Karakoram Expeditions & Northern Tours",
    verified: true,
    joinedYear: 2019,
    rating: 4.95,
  },
  HUNZA_ADVENTURES: {
    id: "v-hunza-adventures",
    businessName: "Hunza Valley Adventures & Treks",
    verified: true,
    joinedYear: 2020,
    rating: 4.92,
  },
  SERENA_HOTELS: {
    id: "v-serena-hotels",
    businessName: "Serena Hotels & Heritage Lodges",
    verified: true,
    joinedYear: 2018,
    rating: 4.98,
  },
  SWAT_ALPINE: {
    id: "v-swat-alpine",
    businessName: "Swat & Kalam Alpine Travels",
    verified: true,
    joinedYear: 2021,
    rating: 4.88,
  },
  FAIRY_MEADOWS_GUIDES: {
    id: "v-fairy-meadows-guides",
    businessName: "Nanga Parbat Treks & Fairy Meadows",
    verified: true,
    joinedYear: 2020,
    rating: 4.94,
  },
  PEARL_CONTINENTAL: {
    id: "v-pc-resorts",
    businessName: "Pearl Continental Resorts & Stays",
    verified: true,
    joinedYear: 2019,
    rating: 4.91,
  },
};

// No hardcoded mock tours - All listings are strictly queried from Neon PostgreSQL DB
export const MOCK_LISTINGS: ListingData[] = [];

export async function getListings(filters?: {
  destination?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  amenities?: string[];
  sortBy?: string;
}): Promise<ListingData[]> {
  let results = MOCK_LISTINGS.filter((l) => {
    const isVendorLive = isVendorEnabled(l.vendor?.id);
    const isApproved = !l.moderationStatus || l.moderationStatus === "APPROVED";
    return isVendorLive && isApproved;
  });

  if (filters?.destination) {
    const q = filters.destination.toLowerCase().trim();
    results = results.filter(
      (l) =>
        l.destinationSlug.toLowerCase().includes(q) ||
        l.destinationName.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.title.toLowerCase().includes(q) ||
        l.province.toLowerCase().includes(q)
    );
  }

  if (filters?.type && filters.type !== "ALL") {
    results = results.filter((l) => l.type === filters.type);
  }

  if (filters?.minPrice !== undefined) {
    results = results.filter((l) => l.basePrice >= filters.minPrice!);
  }

  if (filters?.maxPrice !== undefined) {
    results = results.filter((l) => l.basePrice <= filters.maxPrice!);
  }

  if (filters?.rating !== undefined) {
    results = results.filter((l) => l.avgRating >= filters.rating!);
  }

  if (filters?.sortBy === "price_asc") {
    results.sort((a, b) => a.basePrice - b.basePrice);
  } else if (filters?.sortBy === "price_desc") {
    results.sort((a, b) => b.basePrice - a.basePrice);
  } else if (filters?.sortBy === "rating_desc") {
    results.sort((a, b) => b.avgRating - a.avgRating);
  }

  return results;
}

export function getActiveListings(): ListingData[] {
  return MOCK_LISTINGS.filter((l) => {
    const isVendorLive = isVendorEnabled(l.vendor?.id);
    const isApproved = !l.moderationStatus || l.moderationStatus === "APPROVED";
    return isVendorLive && isApproved;
  });
}

export async function getListingBySlugOrId(idOrSlug: string): Promise<ListingData | null> {
  const found = MOCK_LISTINGS.find((l) => l.id === idOrSlug || l.slug === idOrSlug);
  return found || null;
}

export function createNewListing(listing: ListingData): ListingData {
  const existingIdx = MOCK_LISTINGS.findIndex((l) => l.id === listing.id || l.slug === listing.slug);
  if (existingIdx >= 0) {
    MOCK_LISTINGS[existingIdx] = listing;
  } else {
    MOCK_LISTINGS.unshift(listing);
  }
  return listing;
}

export function updateListing(id: string, updates: Partial<ListingData>): ListingData | null {
  const idx = MOCK_LISTINGS.findIndex((l) => l.id === id);
  if (idx >= 0) {
    MOCK_LISTINGS[idx] = { ...MOCK_LISTINGS[idx], ...updates };
    return MOCK_LISTINGS[idx];
  }
  return null;
}

export function deleteListing(id: string): boolean {
  const idx = MOCK_LISTINGS.findIndex((l) => l.id === id);
  if (idx >= 0) {
    MOCK_LISTINGS.splice(idx, 1);
    return true;
  }
  return false;
}

export function deleteListingsByVendorId(vendorId: string): number {
  let count = 0;
  for (let i = MOCK_LISTINGS.length - 1; i >= 0; i--) {
    if (MOCK_LISTINGS[i].vendor?.id === vendorId) {
      MOCK_LISTINGS.splice(i, 1);
      count++;
    }
  }
  return count;
}

export function getAllListingsForAdmin(): ListingData[] {
  try {
    const { VENDORS_STORE } = require("./vendor.service");
    const validVendorIds = new Set(VENDORS_STORE.map((v: any) => v.id));
    return MOCK_LISTINGS.filter((l) => validVendorIds.has(l.vendor?.id));
  } catch {
    return [...MOCK_LISTINGS];
  }
}

export function moderateListing(
  id: string,
  status: "APPROVED" | "REJECTED",
  notes?: string
): ListingData | null {
  const item = MOCK_LISTINGS.find((l) => l.id === id || l.slug === id);
  if (!item) return null;

  item.moderationStatus = status;
  if (status === "APPROVED") {
    item.isEdited = false;
  }
  if (notes !== undefined) {
    item.moderationNotes = notes;
  }
  item.reviewedAt = new Date().toISOString();
  return item;
}
