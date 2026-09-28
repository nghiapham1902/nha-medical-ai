import { ContactForm } from "@/components/store";
import { PageHeading } from "@/components/page-heading";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { seo } from "@/lib/seo";
export const metadata = seo(
  "Liên hệ & yêu cầu báo giá",
  "Gửi nhu cầu thiết bị và vật tư cho NHA Medical. Biểu mẫu thử nghiệm lưu cục bộ.",
  "/lien-he",
);
export default function Page() {
  return (
    <>
      <PageHeading
        title="Kết nối cùng NHA Medical"
        subtitle="Mỗi nhu cầu là khởi đầu của một giải pháp mới."
      />
      <section className="container section contact-layout">
        <div>
          <span className="eyebrow">THÔNG TIN LIÊN HỆ</span>
          <h2>
            Chúng tôi ở đây
            <br />
            để đồng hành cùng bạn.
          </h2>
          <p>
            Liên hệ với NHA Medical để trao đổi nhu cầu thiết bị, vật tư và nhận
            tư vấn giải pháp phù hợp.
          </p>
          <div className="contact-item">
            <MapPin />
            <div>
              <strong>Địa chỉ</strong>
              <p>91 Hoàng Công, Kiến Hưng, Hà Đông</p>
            </div>
          </div>
          <div className="contact-item">
            <Phone />
            <div>
              <strong>Hotline</strong>
              <p>
                <a href="tel:+84326456768">+84 326 4567 68</a>
              </p>
            </div>
          </div>
          <div className="contact-item">
            <Mail />
            <div>
              <strong>Email</strong>
              <p>
                <a href="mailto:info@nhamedical.vn">info@nhamedical.vn</a>
              </p>
            </div>
          </div>
          <div className="contact-item">
            <Clock />
            <div>
              <strong>Giờ làm việc</strong>
              <p>Sẽ công bố khi vận hành chính thức</p>
            </div>
          </div>
          <div className="map-placeholder">
            <MapPin size={35} />
            <strong>Vị trí NHA Medical</strong>
            <span>91 Hoàng Công, Kiến Hưng, Hà Đông</span>
            <a
              href="https://www.google.com/maps/search/?api=1&query=91+Ho%C3%A0ng+C%C3%B4ng%2C+Ki%E1%BA%BFn+H%C6%B0ng%2C+H%C3%A0+%C4%90%C3%B4ng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Xem trên Google Maps
            </a>
          </div>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
