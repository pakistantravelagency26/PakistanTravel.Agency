import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Guided Northern Pakistan Tour Packages | PakistanTravel";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#071B26",
          backgroundImage: "radial-gradient(circle at 25% 25%, #0B3A53 0%, #05141E 100%)",
          padding: "60px 80px",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              backgroundColor: "#0284C7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 800,
              color: "#FFFFFF",
            }}
          >
            PT
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.5px" }}>
            Pakistan<span style={{ color: "#38BDF8" }}>Travel</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 16px",
              borderRadius: "9999px",
              backgroundColor: "rgba(56, 189, 248, 0.15)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              color: "#BAE6FD",
              fontSize: "16px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            All Destinations & Schedules
          </div>
          <div style={{ fontSize: "56px", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-1.5px" }}>
            Northern Pakistan Tour Packages & Treks
          </div>
          <div style={{ fontSize: "22px", color: "#BAE6FD", lineHeight: 1.4 }}>
            Explore scheduled itineraries for Hunza Valley, Skardu, Swat, and Kumrat directly from independent local operators.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            paddingTop: "24px",
            fontSize: "16px",
            color: "#94A3B8",
          }}
        >
          <div>pakistantravel.agency/tours</div>
          <div>Direct Bookings · Independent Local Operators</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
