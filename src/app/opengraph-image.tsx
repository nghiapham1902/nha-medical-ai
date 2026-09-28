import { ImageResponse } from "next/og";
export const runtime = "edge";
export const alt = "NHA Medical — Thiết bị y tế & phòng thí nghiệm";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#092e43",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 90,
        color: "white",
      }}
    >
      <div style={{ fontSize: 35, color: "#6de0c3", marginBottom: 40 }}>
        NHA MEDICAL
      </div>
      <div style={{ fontSize: 70, fontWeight: 700 }}>Y tế & khoa học</div>
      <div style={{ fontSize: 36, marginTop: 25 }}>
        Thiết bị · Vật tư · Giải pháp
      </div>
      <div style={{ fontSize: 22, marginTop: 60, color: "#a7cbc9" }}>
        Website demo
      </div>
    </div>,
    size,
  );
}
