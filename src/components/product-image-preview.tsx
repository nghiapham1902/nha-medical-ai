"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff, ImagePlus } from "lucide-react";
import { validateUrl } from "@/lib/catalog-validation";

export function ProductImagePreview({
  src,
  label,
  emptyText = "Nhập URL ảnh để xem trước",
}: {
  src?: string;
  label: string;
  emptyText?: string;
}) {
  let source = "";
  try {
    source = validateUrl(src || "");
  } catch {
    // Keep incomplete URLs editable without sending invalid image requests.
  }
  return (
    <Preview
      key={source}
      source={source}
      label={label}
      placeholder={
        src?.trim() ? "Nhập URL HTTPS hoặc đường dẫn ảnh hợp lệ" : emptyText
      }
    />
  );
}

function Preview({
  source,
  label,
  placeholder,
}: {
  source: string;
  label: string;
  placeholder: string;
}) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  return (
    <figure className="product-image-preview">
      <div
        className="product-image-preview-stage"
        aria-busy={Boolean(source) && state === "loading"}
      >
        {source && state !== "error" ? (
          <>
            {state === "loading" && (
              <span className="product-image-preview-hint">Đang tải ảnh…</span>
            )}
            <Image
              src={source}
              alt={label}
              fill
              unoptimized
              sizes="(max-width: 600px) 90vw, 400px"
              onLoad={() => setState("ready")}
              onError={() => setState("error")}
            />
          </>
        ) : (
          <div className="product-image-preview-placeholder">
            {state === "error" ? (
              <ImageOff size={28} aria-hidden="true" />
            ) : (
              <ImagePlus size={28} aria-hidden="true" />
            )}
            <span>
              {state === "error"
                ? "Không tải được ảnh. Kiểm tra lại đường dẫn."
                : placeholder}
            </span>
          </div>
        )}
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  );
}
