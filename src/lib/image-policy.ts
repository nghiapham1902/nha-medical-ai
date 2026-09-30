// Only optimize known local public images. Vendor URLs remain direct without a broad allowlist.
export function canOptimizeImage(src: string) {
  return src.startsWith("/images/") && !src.includes("?") && !src.includes("#");
}
