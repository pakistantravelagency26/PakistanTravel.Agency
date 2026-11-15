import { prisma } from "@/lib/prisma";
import { destinationsData, DestinationSeoData } from "@/data/destinationData";
import { revalidatePath } from "next/cache";

export async function getDestinationContent(slug: string): Promise<DestinationSeoData | null> {
  const normalizedSlug = slug.toLowerCase().trim();
  const base = destinationsData[normalizedSlug];

  if (!base) {
    return null;
  }

  try {
    const key = `DEST_CONTENT_${normalizedSlug.toUpperCase()}`;
    const setting = await prisma.siteSetting.findUnique({
      where: { key },
    });

    if (setting && setting.value && typeof setting.value === "object") {
      const v: any = setting.value;
      return {
        ...base,
        name: v.name || base.name,
        province: v.province || base.province,
        tagline: v.tagline || base.tagline,
        seoTitle: v.seoTitle || base.seoTitle,
        seoDescription: v.seoDescription || base.seoDescription,
        heroImage: v.heroImage || base.heroImage,
        approximateCosts: {
          budgetPerDay: v.approximateCosts?.budgetPerDay ?? base.approximateCosts.budgetPerDay,
          midRangePerDay: v.approximateCosts?.midRangePerDay ?? base.approximateCosts.midRangePerDay,
          luxuryPerDay: v.approximateCosts?.luxuryPerDay ?? base.approximateCosts.luxuryPerDay,
          notes: v.approximateCosts?.notes ?? base.approximateCosts.notes,
        },
        topAttractions: Array.isArray(v.topAttractions) && v.topAttractions.length > 0
          ? v.topAttractions
          : base.topAttractions,
        bestTimeToVisit: {
          peakSeason: v.bestTimeToVisit?.peakSeason ?? base.bestTimeToVisit.peakSeason,
          peakDescription: v.bestTimeToVisit?.peakDescription ?? base.bestTimeToVisit.peakDescription,
          shoulderSeason: v.bestTimeToVisit?.shoulderSeason ?? base.bestTimeToVisit.shoulderSeason,
          shoulderDescription: v.bestTimeToVisit?.shoulderDescription ?? base.bestTimeToVisit.shoulderDescription,
          offSeason: v.bestTimeToVisit?.offSeason ?? base.bestTimeToVisit.offSeason,
          offDescription: v.bestTimeToVisit?.offDescription ?? base.bestTimeToVisit.offDescription,
        },
        overview: Array.isArray(v.overview) && v.overview.length > 0 ? v.overview : base.overview,
        faqs: Array.isArray(v.faqs) && v.faqs.length > 0 ? v.faqs : base.faqs,
      };
    }
  } catch (error) {
    console.warn(`[getDestinationContent] Error loading overrides for ${slug}, using default:`, error);
  }

  return base;
}

export async function saveDestinationContent(
  slug: string,
  content: Partial<DestinationSeoData>
) {
  const normalizedSlug = slug.toLowerCase().trim();
  const key = `DEST_CONTENT_${normalizedSlug.toUpperCase()}`;

  const current = (await getDestinationContent(normalizedSlug)) || destinationsData[normalizedSlug] || {};

  const mergedValue = {
    ...current,
    ...content,
    approximateCosts: {
      ...(current.approximateCosts || {}),
      ...(content.approximateCosts || {}),
    },
    topAttractions: content.topAttractions || current.topAttractions || [],
    bestTimeToVisit: {
      ...(current.bestTimeToVisit || {}),
      ...(content.bestTimeToVisit || {}),
    },
  };

  const updated = await prisma.siteSetting.upsert({
    where: { key },
    update: { value: mergedValue as any },
    create: { key, value: mergedValue as any },
  });

  try {
    revalidatePath(`/destinations/${normalizedSlug}`);
    revalidatePath("/destinations");
  } catch (e) {
    console.warn("Revalidation warning in saveDestinationContent:", e);
  }

  return updated;
}
