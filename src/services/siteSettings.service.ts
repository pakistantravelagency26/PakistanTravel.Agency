/**
 * Dynamic Site Settings Service (Database-Backed with Fallback)
 *
 * Allows Super Admin to modify titles, texts, contact info,
 * hero banners, and feature cards across the entire website live
 * without requiring code commits or rebuilds.
 */

import { prisma } from "../lib/prisma.ts";
import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettingsKey,
} from "../config/siteSettings.constants.ts";

// Re-export all types and default constants for backward-compatible server imports
export * from "../config/siteSettings.constants.ts";

export async function getSiteSettings(key?: SiteSettingsKey): Promise<any> {
  try {
    if (key) {
      const record = await prisma.siteSetting.findUnique({
        where: { key },
      });
      if (record && record.value) {
        if (Array.isArray(DEFAULT_SITE_SETTINGS[key])) {
          return Array.isArray(record.value) ? record.value : DEFAULT_SITE_SETTINGS[key];
        }
        return { ...DEFAULT_SITE_SETTINGS[key], ...(record.value as object) };
      }
      return DEFAULT_SITE_SETTINGS[key];
    }

    const allRecords = await prisma.siteSetting.findMany();
    const result: Record<string, any> = { ...DEFAULT_SITE_SETTINGS };

    for (const r of allRecords) {
      if (r.key in DEFAULT_SITE_SETTINGS) {
        const defaultVal = DEFAULT_SITE_SETTINGS[r.key as SiteSettingsKey];
        if (Array.isArray(defaultVal)) {
          result[r.key] = Array.isArray(r.value) ? r.value : defaultVal;
        } else {
          result[r.key] = { ...defaultVal, ...(r.value as object) };
        }
      }
    }

    return result;
  } catch (err) {
    console.error("Neon DB SiteSetting read error, returning in-memory defaults:", err);
    return key ? DEFAULT_SITE_SETTINGS[key] : DEFAULT_SITE_SETTINGS;
  }
}

export async function updateSiteSetting(key: SiteSettingsKey, value: any) {
  const updated = await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  return updated;
}
