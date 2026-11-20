import { z } from "zod";

export const travelCostsSchema = z.object({
  heading: z.string().trim().min(1).max(160),
  budgetPerDay: z.string().trim().min(1).max(100),
  midRangePerDay: z.string().trim().min(1).max(100),
  luxuryPerDay: z.string().trim().min(1).max(100),
  budgetDescription: z.string().trim().min(1).max(500),
  midRangeDescription: z.string().trim().min(1).max(500),
  luxuryDescription: z.string().trim().min(1).max(500),
  notes: z.string().trim().min(1).max(2000),
}).strict();

export type TravelCosts = z.infer<typeof travelCostsSchema>;

export function defaultTravelCosts(costs: {
  budgetPerDay: string;
  midRangePerDay: string;
  luxuryPerDay: string;
  notes: string;
}): TravelCosts {
  return {
    heading: "Approximate Travel Costs (2026 Season)",
    ...costs,
    budgetDescription: "Per person per day including clean guesthouse and local dining.",
    midRangeDescription: "Estimated per traveler with standard hotel accommodation and guided transport.",
    luxuryDescription: "Heritage suites, luxury valley lodges, and private mountain transport included in itinerary.",
  };
}

export function resolveTravelCosts(defaults: TravelCosts, stored: unknown): TravelCosts {
  const parsed = travelCostsSchema.partial().safeParse(stored);
  return parsed.success ? { ...defaults, ...parsed.data } : defaults;
}

export function travelCostsKey(slug: string): string {
  return `DESTINATION_TRAVEL_COSTS:${slug}`;
}
