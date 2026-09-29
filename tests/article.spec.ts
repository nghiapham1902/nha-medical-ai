import { test, expect } from "@playwright/test";
import { ARTICLE_PREFIX, articleContent } from "../src/lib/article-format";
import { cleanArticle, sanitizeIntroduction } from "../src/lib/article-html";

test("legacy introductions keep literal HTML and Vietnamese text", () => {
  const value = 'Mô tả <script>alert(1)</script>\nDòng thứ hai';
  expect(sanitizeIntroduction(value)).toBe(value);
  expect(articleContent(value)).toContain('&lt;script&gt;');
  expect(articleContent(value)).toContain('<p>Dòng thứ hai</p>');
});
test("article formatting, images and tables survive a save round trip", () => {
  const html = '<h2>Công nghệ</h2><p><strong>Đậm</strong> <em>Nghiêng</em></p><ul><li>Tính năng</li></ul><img src="https://example.com/image.jpg" alt="Ảnh thiết bị" /><table><tbody><tr><th>Thông số</th><td>4K</td></tr></tbody></table>';
  const saved = sanitizeIntroduction(ARTICLE_PREFIX + html);
  for (const fragment of ['<h2>Công nghệ</h2>', '<strong>Đậm</strong>', 'Ảnh thiết bị', '<td>4K</td>']) expect(saved).toContain(fragment);
  expect(articleContent(saved)).toBe(cleanArticle(html));
});
test("article HTML strips executable markup and unsafe image/link URLs", () => {
  const clean = cleanArticle('<script>alert(1)</script><iframe src="https://evil.test"></iframe><img src="javascript:alert(1)" onerror="alert(2)"><img src="//evil.test/a"><img src="https://example.com/a" onload="alert(3)"><a href="javascript:alert(4)" onclick="alert(5)">link</a><p style="position:fixed">Text</p>');
  for (const value of ['<script', '<iframe', 'javascript:', 'onerror', 'onload', 'onclick', 'style=', '//evil.test']) expect(clean).not.toContain(value);
  expect(clean).toContain('https://example.com/a');
  expect(clean).toContain('Text');
});
