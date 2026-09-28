/** @jsxImportSource react */
"use client";

import { useEffect, useState } from "react";
import { CircleCheck, CircleAlert, X } from "lucide-react";

type NoticeProps = {
  message: string;
  kind: "success" | "error";
  onClose: () => void;
};

export function AdminNotice(props: NoticeProps) {
  if (!props.message) return null;
  return <NoticeContent key={`${props.kind}-${props.message}`} {...props} />;
}

function NoticeContent({ message, kind, onClose }: NoticeProps) {
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(onClose, 220);
    return () => window.clearTimeout(timer);
  }, [closing, onClose]);
  const Icon = kind === "success" ? CircleCheck : CircleAlert;
  return (
    <div
      className={`admin-notice admin-notice-${kind}`}
      data-closing={closing || undefined}
      role={kind === "error" ? "alert" : "status"}
      aria-atomic="true"
    >
      <span className="admin-notice-icon" aria-hidden="true">
        <Icon size={22} />
      </span>
      <div className="admin-notice-content">
        <strong>
          {kind === "success" ? "Thành công" : "Cần kiểm tra lại"}
        </strong>
        <p>{message}</p>
      </div>
      <button
        type="button"
        aria-label="Đóng thông báo"
        disabled={closing}
        onClick={() => setClosing(true)}
      >
        <X size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
