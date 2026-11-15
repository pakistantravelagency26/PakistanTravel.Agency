import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get("title") || "Pakistan Travel Agency";
    const category = searchParams.get("category") || "EXPLORE NORTHERN PAKISTAN";
    const subtitle = searchParams.get("subtitle") || "Authentic Guided Tours & Mountain Expeditions";
    const tag = searchParams.get("tag") || "PakistanTravel.Agency";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#022c22",
            backgroundImage: "radial-gradient(circle at 25% 25%, #064e3b 0%, #022c22 70%)",
            padding: "60px 80px",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            color: "#ffffff",
          }}
        >
          {/* Top Bar: Brand and Category Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "#059669",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "26px",
                  color: "#ffffff",
                  boxShadow: "0 4px 12px rgba(5, 150, 105, 0.4)",
                }}
              >
                P
              </div>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                  color: "#ecfdf5",
                }}
              >
                Pakistan<span style={{ color: "#34d399" }}>Travel</span>
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(5, 150, 105, 0.25)",
                border: "1px solid rgba(52, 211, 153, 0.4)",
                borderRadius: "9999px",
                padding: "8px 20px",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "#6ee7b7",
              }}
            >
              {category}
            </div>
          </div>

          {/* Middle: Title & Subtitle */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                fontSize: title.length > 50 ? "46px" : "56px",
                fontWeight: 800,
                lineHeight: 1.15,
                color: "#ffffff",
                letterSpacing: "-1px",
                maxWidth: "1000px",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  fontSize: "22px",
                  color: "#a7f3d0",
                  lineHeight: 1.4,
                  maxWidth: "900px",
                  fontWeight: 400,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          {/* Bottom Bar: Tag and Trust Indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255, 255, 255, 0.15)",
              paddingTop: "28px",
              width: "100%",
            }}
          >
            <div
              style={{
                fontSize: "17px",
                color: "#94a3b8",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>{tag}</span>
            </div>
            <div
              style={{
                fontSize: "16px",
                color: "#34d399",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>pakistantravel.agency</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
