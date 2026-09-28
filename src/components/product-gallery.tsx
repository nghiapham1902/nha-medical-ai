/** @jsxImportSource react */
"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  ImageOff,
  ZoomIn,
  X,
} from "lucide-react";
import type { ProductMedia } from "@/lib/data";

import { videoSource } from "@/lib/video-source";

export function ProductGallery({
  name,
  image,
  media,
}: {
  name: string;
  image?: string;
  media?: ProductMedia[];
}) {
  const items: ProductMedia[] = media?.length
    ? media
    : image
      ? [{ type: "image", src: image, alt: name }]
      : [];
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const current = items[index] ?? items[0];
  const select = (next: number) => {
    setIndex((next + items.length) % items.length);
    setFailed(false);
  };
  if (!current)
    return (
      <section className="product-gallery" aria-label={`Hình ảnh ${name}`}>
        <div className="gallery-stage">
          <div className="gallery-error">
            <ImageOff size={40} strokeWidth={1.3} aria-hidden="true" />
            <strong>Hình ảnh đang được cập nhật</strong>
            <p>Chưa có ảnh xác minh theo model cho sản phẩm này.</p>
          </div>
        </div>
      </section>
    );
  const title = current.type === "image" ? current.alt : current.title;
  const video = current.type === "video" ? videoSource(current.src) : null;
  return (
    <section
      className="product-gallery"
      aria-label={`Hình ảnh và video ${name}`}
    >
      <div className="gallery-stage">
        {failed || (current.type === "video" && !video) ? (
          <div className="gallery-error" role="status">
            <ImageOff size={32} />
            <p>Không tải được nội dung này. Vui lòng thử lại sau.</p>
            <button type="button" onClick={() => setFailed(false)}>
              Thử lại
            </button>
          </div>
        ) : current.type === "video" ? (
          video?.kind === "file" ? (
            <video
              key={current.src}
              src={current.src}
              poster={current.poster}
              controls
              playsInline
              preload="metadata"
              aria-label={current.title}
              onError={() => setFailed(true)}
            />
          ) : (
            <iframe
              key={current.src}
              src={video?.src}
              title={current.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              loading="lazy"
              onError={() => setFailed(true)}
            />
          )
        ) : (
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            unoptimized
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => setFailed(true)}
          />
        )}
        {!failed && current.type === "image" && (
          <button
            type="button"
            className="gallery-zoom"
            aria-label="Mở ảnh lớn"
            onClick={() => dialog.current?.showModal()}
          >
            <ZoomIn size={20} />
          </button>
        )}
        {items.length > 1 && (
          <div className="gallery-arrows">
            <button
              type="button"
              onClick={() => select(index - 1)}
              aria-label="Nội dung trước"
            >
              <ChevronLeft size={21} />
            </button>
            <button
              type="button"
              onClick={() => select(index + 1)}
              aria-label="Nội dung tiếp theo"
            >
              <ChevronRight size={21} />
            </button>
          </div>
        )}
      </div>
      <dialog
        ref={dialog}
        className="gallery-dialog"
        aria-label={`Ảnh lớn: ${name}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <header>
          <span>{title}</span>
          <button
            type="button"
            className="icon-button"
            aria-label="Đóng ảnh lớn"
            onClick={() => dialog.current?.close()}
          >
            <X />
          </button>
        </header>
        {current.type === "image" && (
          <div className="gallery-dialog-image">
            <Image
              src={current.src}
              alt={current.alt}
              fill
              unoptimized
              sizes="90vw"
            />
          </div>
        )}
      </dialog>
      {current.type === "video" && video && (
        <p className="gallery-video-help">
          Nếu video không phát,{" "}
          <a href={current.src} target="_blank" rel="noopener noreferrer">
            mở video ở trang gốc
          </a>
          .
        </p>
      )}
      <div className="gallery-caption" aria-live="polite">
        <span>{title}</span>
        <span>
          {index + 1} / {items.length}
        </span>
      </div>
      {items.length > 1 && (
        <div className="gallery-thumbnails" aria-label="Chọn ảnh hoặc video">
          {items.map((item, i) => (
            <button
              key={`${item.src}-${i}`}
              type="button"
              aria-pressed={i === index}
              aria-label={
                item.type === "image"
                  ? `Xem ảnh ${i + 1}: ${item.alt}`
                  : `Xem video: ${item.title}`
              }
              onClick={() => select(i)}
            >
              {item.type === "image" ? (
                <Image src={item.src} alt="" fill unoptimized sizes="88px" />
              ) : (
                <>
                  <Play size={24} />
                  <span>Video</span>
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
