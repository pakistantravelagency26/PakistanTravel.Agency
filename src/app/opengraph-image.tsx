import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Northern Pakistan Tour Packages | PakistanTravel";
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
          backgroundColor: "#062817",
          backgroundImage: "radial-gradient(circle at 25% 25%, #0A5C36 0%, #031D10 100%)",
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
              backgroundColor: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 800,
              color: "#031D10",
            }}
          >
            PK
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
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#6EE7B7",
              fontSize: "16px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Tour Operator Marketplace
          </div>
          <div style={{ fontSize: "56px", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-1.5px" }}>
            Northern Pakistan Guided Tour Packages
          </div>
          <div style={{ fontSize: "22px", color: "#A7F3D0", lineHeight: 1.4 }}>
            Compare guided mountain expeditions across Hunza, Skardu, Swat, and Kumrat from independent local operators.
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
          <div>pakistantravel.agency</div>
          <div>Direct Local Departures · Digital Vouchers</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
