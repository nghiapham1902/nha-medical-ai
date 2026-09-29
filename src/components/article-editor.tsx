"use client";
import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import { ARTICLE_PREFIX, articleContent } from "@/lib/article-format";
import { validateUrl } from "@/lib/catalog-validation";

export function ArticleEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [insert, setInsert] = useState<"image" | "link" | null>(null);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, protocols: ["https"] } }), Image, TableKit],
    content: articleContent(value),
    editorProps: { attributes: { class: "article-body article-input", role: "textbox", "aria-label": "Bài viết giới thiệu sản phẩm", "aria-multiline": "true" } },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : ARTICLE_PREFIX + editor.getHTML()),
  });
  useEffect(() => {
    if (editor && value !== ARTICLE_PREFIX + editor.getHTML() && !(editor.isEmpty && !value)) {
      editor.commands.setContent(articleContent(value), { emitUpdate: false });
    }
  }, [editor, value]);
  if (!editor) return <p>Đang tải trình soạn thảo…</p>;
  const button = (label: string, action: () => void, active = false) => (
    <button type="button" aria-pressed={active} onClick={action}>{label}</button>
  );
  function addMedia() {
    try {
      const src = validateUrl(url, true);
      if (insert === "image") {
        editor!.chain().focus().setImage({ src, alt: caption, title: caption }).run();
        if (caption.trim()) editor!.chain().focus().insertContent({ type: "paragraph", content: [{ type: "text", text: caption, marks: [{ type: "italic" }] }] }).run();
      } else {
        editor!.chain().focus().extendMarkRange("link").setLink({ href: src }).run();
      }
      setInsert(null); setUrl(""); setCaption(""); setError("");
    } catch { setError("Nhập URL HTTPS hợp lệ hoặc đường dẫn /images/…"); }
  }
  return <div className="article-editor">
    <strong>Giới thiệu — bài viết chi tiết</strong>
    <div className="article-toolbar" role="group" aria-label="Định dạng bài viết">
      {button("Đoạn văn", () => { editor.chain().focus().setParagraph().run(); }, editor.isActive("paragraph"))}
      {button("Tiêu đề 2", () => { editor.chain().focus().toggleHeading({ level: 2 }).run(); }, editor.isActive("heading", { level: 2 }))}
      {button("Tiêu đề 3", () => { editor.chain().focus().toggleHeading({ level: 3 }).run(); }, editor.isActive("heading", { level: 3 }))}
      {button("Đậm", () => { editor.chain().focus().toggleBold().run(); }, editor.isActive("bold"))}
      {button("Nghiêng", () => { editor.chain().focus().toggleItalic().run(); }, editor.isActive("italic"))}
      {button("Gạch chân", () => { editor.chain().focus().toggleUnderline().run(); }, editor.isActive("underline"))}
      {button("Danh sách", () => { editor.chain().focus().toggleBulletList().run(); }, editor.isActive("bulletList"))}
      {button("Đánh số", () => { editor.chain().focus().toggleOrderedList().run(); }, editor.isActive("orderedList"))}
      {button("Chèn ảnh", () => { setInsert("image"); setError(""); })}
      {button("Liên kết", () => { setInsert("link"); setUrl(editor.getAttributes("link").href || ""); setError(""); })}
      {button("Bỏ liên kết", () => { editor.chain().focus().unsetLink().run(); })}
      {button("Chèn bảng", () => { editor.chain().focus().insertTable({ rows: 3, cols: 2, withHeaderRow: true }).run(); })}
      {editor.isActive("table") && <>
        {button("Thêm hàng", () => { editor.chain().focus().addRowAfter().run(); })}
        {button("Thêm cột", () => { editor.chain().focus().addColumnAfter().run(); })}
        {button("Xóa hàng", () => { editor.chain().focus().deleteRow().run(); })}
        {button("Xóa cột", () => { editor.chain().focus().deleteColumn().run(); })}
        {button("Xóa bảng", () => { editor.chain().focus().deleteTable().run(); })}
      </>}
      {button("Hoàn tác", () => { editor.chain().focus().undo().run(); })}
      {button("Làm lại", () => { editor.chain().focus().redo().run(); })}
    </div>
    {insert && <div className="article-insert">
      <label>{insert === "image" ? "URL ảnh" : "URL liên kết (bôi đen chữ trước khi chèn)"}<input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://…" /></label>
      {insert === "image" && <label>Mô tả / chú thích ảnh<input value={caption} onChange={e => setCaption(e.target.value)} maxLength={300} /></label>}
      <button type="button" className="button secondary" onClick={addMedia}>Chèn</button>
      <button type="button" className="button secondary" onClick={() => setInsert(null)}>Hủy</button>
      {error && <p role="alert">{error}</p>}
    </div>}
    <EditorContent editor={editor} />
    <small role={value.length > 20000 ? "alert" : undefined}>{value.length.toLocaleString("vi")} / 20.000 ký tự, gồm định dạng. {value.length > 20000 ? "Bài viết quá dài, hãy rút gọn trước khi lưu." : "Ảnh được chèn bằng đường dẫn; bài viết lưu cùng sản phẩm."}</small>
  </div>;
}
