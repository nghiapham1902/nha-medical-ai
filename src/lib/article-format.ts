export const ARTICLE_PREFIX = "<!--nha-article-v1-->";
export function articleContent(value: string) {
  if (value.startsWith(ARTICLE_PREFIX)) return value.slice(ARTICLE_PREFIX.length);
  return value.split(/\r?\n/).map(line => `<p>${line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")}</p>`).join("");
}
