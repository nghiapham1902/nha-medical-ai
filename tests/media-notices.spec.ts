import { test, expect } from "@playwright/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { videoSource } from "../src/lib/video-source";
import { ProductGallery } from "../src/components/product-gallery";
import { AdminNotice } from "../src/components/admin-notice";

test("YouTube watch, share, shorts, live and embed links resolve to one playable embed", () => {
  const id = "M7lc1UVf-VE";
  for (const url of [
    `https://www.youtube.com/watch?v=${id}&feature=shared`,
    `https://youtu.be/${id}?si=share`,
    `https://m.youtube.com/watch?v=${id}`,
    `https://www.youtube.com/shorts/${id}`,
    `https://youtube.com/live/${id}`,
    `https://www.youtube.com/embed/${id}`,
    `https://www.youtube-nocookie.com/embed/${id}`,
  ]) {
    expect(videoSource(url)).toEqual({
      kind: "embed",
      src: `https://www.youtube.com/embed/${id}?playsinline=1`,
    });
  }
  expect(videoSource(`https://youtu.be/${id}?t=42`)?.src).toContain("start=42");
});

test("file URLs stay native videos and arbitrary pages never become iframes", () => {
  for (const src of [
    "/video/demo.mp4",
    "https://cdn.example.com/video.mp4?token=abc#t=5",
    "https://cdn.example.com/stream/123",
    "https://youtube.com.evil.example/watch?v=M7lc1UVf-VE",
  ]) {
    expect(videoSource(src)).toEqual({ kind: "file", src });
  }
  for (const src of [
    "javascript:alert(1)",
    "https://youtube.com/watch?v=bad",
    "https://youtube.com/@channel",
    "https://user:secret@example.com/video",
  ]) {
    expect(videoSource(src)).toBeNull();
  }
  expect(videoSource("https://vimeo.com/123456/abcdef")).toEqual({
    kind: "embed",
    src: "https://player.vimeo.com/video/123456?h=abcdef",
  });
});

test("gallery renders YouTube as iframe with fullscreen and a source fallback", () => {
  const html = renderToStaticMarkup(
    createElement(ProductGallery, {
      name: "Demo",
      media: [
        {
          type: "video",
          src: "https://youtu.be/M7lc1UVf-VE",
          title: "Demo video",
        },
      ],
    }),
  );
  expect(html).toContain("<iframe");
  expect(html).toContain(
    'src="https://www.youtube.com/embed/M7lc1UVf-VE?playsinline=1"',
  );
  expect(html).toContain("allowFullScreen");
  expect(html).toContain('href="https://youtu.be/M7lc1UVf-VE"');
  expect(html).not.toContain("<video");
});

test("empty notices are absent and CRUD results use accessible dismissible messages", () => {
  expect(
    renderToStaticMarkup(
      createElement(AdminNotice, {
        kind: "success",
        message: "",
        onClose() {},
      }),
    ),
  ).toBe("");
  for (const kind of ["success", "error"] as const) {
    const html = renderToStaticMarkup(
      createElement(AdminNotice, {
        kind,
        message: "Kết quả thao tác",
        onClose() {},
      }),
    );
    expect(html).toContain(`role="${kind === "success" ? "status" : "alert"}"`);
    expect(html).toContain('aria-label="Đóng thông báo"');
    expect(html).toContain("Kết quả thao tác");
  }
});
