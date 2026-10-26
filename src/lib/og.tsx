import { ImageResponse } from "next/og";
export function makeOg(subtitle = "Every size. Every shape.") {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0d0d14",
        color: "#f0f0f5",
        fontFamily: "sans-serif",
        gap: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 24,
          color: "#ff9aab",
          letterSpacing: 5,
        }}
      >
        WORLDWIDE CREATOR DISCOVERY
      </div>
      <div style={{ display: "flex", fontSize: 110, fontWeight: 800 }}>
        Only<span style={{ color: "#f43f73" }}>Boobs</span>
      </div>
      <div style={{ display: "flex", fontSize: 38, color: "#ccc6d3" }}>
        {subtitle}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 22,
          color: "#a6a1b0",
          marginTop: 36,
        }}
      >
        onlyboobs.co · Adults 18+
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
