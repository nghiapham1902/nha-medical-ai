import sanitizeHtml from "sanitize-html";
import { ARTICLE_PREFIX } from "./article-format";
import { validateUrl } from "./catalog-validation";

export function cleanArticle(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "h2", "h3", "strong", "em", "u", "s", "ul", "ol", "li", "blockquote", "a", "img", "table", "thead", "tbody", "tr", "th", "td", "hr"],
    allowedAttributes: { a: ["href", "rel"], img: ["src", "alt", "title"], th: ["colspan", "rowspan"], td: ["colspan", "rowspan"] },
    allowedSchemes: ["https"],
    allowProtocolRelative: false,
    transformTags: {
      a: (_tag, attrs) => {
        let href = "";
        try { href = validateUrl(attrs.href); } catch {}
        return { tagName: "a", attribs: { href, rel: "noopener noreferrer" } };
      },
    },
    exclusiveFilter: frame => {
      if (frame.tag !== "img") return false;
      try { return !validateUrl(frame.attribs.src, true); } catch { return true; }
    },
  });
}
export function sanitizeIntroduction(value: string) {
  return value.startsWith(ARTICLE_PREFIX)
    ? ARTICLE_PREFIX + cleanArticle(value.slice(ARTICLE_PREFIX.length))
    : value;
}
