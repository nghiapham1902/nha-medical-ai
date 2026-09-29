import {
  Microscope, Package, HeartPulse, TestTubes, FlaskConical, ShieldCheck,
  Scissors, Activity, Scan, Baby, ShieldPlus, Dna, Stethoscope, Syringe, Droplets,
} from "lucide-react";
import type { CategoryInput } from "@/lib/catalog";

export const categoryIcons = {
  Microscope, Package, HeartPulse, TestTubes, FlaskConical, ShieldCheck,
  Scissors, Activity, Scan, Baby, ShieldPlus, Dna, Stethoscope, Syringe, Droplets,
};
export const categoryIconLabels: Record<CategoryInput["icon"], string> = {
  Microscope: "Kính hiển vi",
  Package: "Vật tư y tế",
  HeartPulse: "Chăm sóc sức khỏe",
  TestTubes: "Thiết bị xét nghiệm",
  FlaskConical: "Phòng thí nghiệm",
  ShieldCheck: "Bảo hộ y tế",
  Scissors: "Phẫu thuật & dụng cụ nội soi",
  Activity: "Cấp cứu & hồi sức tích cực",
  Scan: "Chẩn đoán hình ảnh & thăm dò",
  Baby: "Sản khoa & hỗ trợ sinh sản",
  ShieldPlus: "Kiểm soát nhiễm khuẩn",
  Dna: "Vi sinh, huyết học & tế bào gốc",
  Stethoscope: "Nội soi tiêu hóa",
  Syringe: "Sinh thiết & chẩn đoán",
  Droplets: "Thận & tiết niệu",
};
export function CategoryIcon({ name, size = 24 }: { name: CategoryInput["icon"]; size?: number }) {
  const Icon = categoryIcons[name] || Package;
  return <Icon size={size} strokeWidth={1.7} aria-hidden="true" />;
}
