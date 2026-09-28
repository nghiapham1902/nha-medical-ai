export function videoSource(
  source: string,
): { kind: "embed" | "file"; src: string } | null {
  const value = source.trim();
  try {
    const url = new URL(value, "https://local.invalid");
    if (url.protocol !== "https:" || url.username || url.password) return null;
    const host = url.hostname.replace(/^www\./, "");
    const parts = url.pathname.split("/").filter(Boolean);
    if (
      [
        "youtube.com",
        "m.youtube.com",
        "youtube-nocookie.com",
        "youtu.be",
      ].includes(host)
    ) {
      const id =
        host === "youtu.be"
          ? parts[0]
          : parts[0] === "watch"
            ? url.searchParams.get("v")
            : ["embed", "shorts", "live"].includes(parts[0])
              ? parts[1]
              : null;
      if (!id || !/^[a-zA-Z0-9_-]{11}$/.test(id)) return null;
      const embed = new URL(`https://www.youtube.com/embed/${id}`);
      embed.searchParams.set("playsinline", "1");
      const time = url.searchParams.get("start") || url.searchParams.get("t");
      if (time && /^\d+$/.test(time)) embed.searchParams.set("start", time);
      return { kind: "embed", src: embed.toString() };
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id =
        host === "vimeo.com"
          ? parts[0]
          : parts[0] === "video"
            ? parts[1]
            : null;
      if (!id || !/^\d+$/.test(id)) return null;
      const embed = new URL(`https://player.vimeo.com/video/${id}`);
      const hash =
        url.searchParams.get("h") || (host === "vimeo.com" ? parts[1] : null);
      if (hash && /^[a-zA-Z0-9]+$/.test(hash))
        embed.searchParams.set("h", hash);
      return { kind: "embed", src: embed.toString() };
    }
    // CDN video endpoints may have no file extension; only known providers use iframes.
    if (value.startsWith("https://") || /^\/(?!\/)/.test(value))
      return { kind: "file", src: value };
  } catch {}
  return null;
}
