/** @jsxImportSource react */
import { CircleCheck, CircleAlert, X } from "lucide-react";

export function AdminNotice({
  message,
  kind,
  onClose,
}: {
  message: string;
  kind: "success" | "error";
  onClose: () => void;
}) {
  if (!message) return null;
  const Icon = kind === "success" ? CircleCheck : CircleAlert;
  return (
    <div
      className={`admin-notice admin-notice-${kind}`}
      role={kind === "error" ? "alert" : "status"}
      aria-atomic="true"
    >
      <Icon size={22} aria-hidden="true" />
      <div>
        <strong>
          {kind === "success" ? "Thành công" : "Cần kiểm tra lại"}
        </strong>
        <p>{message}</p>
      </div>
      <button type="button" aria-label="Đóng thông báo" onClick={onClose}>
        <X size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
