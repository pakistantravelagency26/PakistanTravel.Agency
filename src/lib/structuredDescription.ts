export function parseStructuredDescription(text = "") {
  // Sanitize raw HTML tags to prevent XSS
  const sanitized = text.replace(/<[^>]*>/g, "").trim();

  const sections = {
    summary: "",
    route: [] as string[],
    meetingPoints: [] as string[],
    itinerary: [] as { day: string; title: string; text: string }[],
    seasonalNotice: "",
    permitsNotice: "",
  };

  const lines = sanitized.split("\n").map(l => l.trim()).filter(Boolean);

  let currentMode = "summary";
  const summaryLines: string[] = [];

  for (const line of lines) {
    if (line.includes("Tour Journey & Sightseeing Route") || line.includes("📍")) {
      currentMode = "route";
      continue;
    }
    if (line.includes("Departure & Pickup Meeting Points") || line.includes("🚐")) {
      currentMode = "meeting";
      continue;
    }
    if (line.includes("Day-by-Day Itinerary") || line.includes("📅")) {
      currentMode = "itinerary";
      continue;
    }
    if (line.includes("Seasonal Mountain Route Notice") || line.includes("⚠️")) {
      currentMode = "seasonal";
      continue;
    }
    if (line.includes("Identification & Permits") || line.includes("🛂")) {
      currentMode = "permits";
      continue;
    }

    if (currentMode === "summary") {
      summaryLines.push(line);
    } else if (currentMode === "route") {
      const stops = line.split(/[➔\->]/).map(s => s.trim()).filter(Boolean);
      sections.route.push(...stops);
    } else if (currentMode === "meeting") {
      const cleaned = line.replace(/^\d+[\.\)]\s*/, "").trim();
      if (cleaned) sections.meetingPoints.push(cleaned);
    } else if (currentMode === "itinerary") {
      const match = line.match(/^•?\s*Day\s*(\d+)[\:\-]?\s*(.*)$/i);
      if (match) {
        const dayNum = `Day ${match[1]}`;
        const parts = match[2].split(":");
        const title = parts.length > 1 ? parts[0].trim() : `Day ${match[1]}`;
        const detail = parts.length > 1 ? parts.slice(1).join(":").trim() : match[2].trim();
        sections.itinerary.push({ day: dayNum, title, text: detail });
      }
    } else if (currentMode === "seasonal") {
      sections.seasonalNotice = (sections.seasonalNotice + " " + line).trim();
    } else if (currentMode === "permits") {
      sections.permitsNotice = (sections.permitsNotice + " " + line).trim();
    }
  }

  sections.summary = summaryLines.join("\n\n");
  return sections;
}
