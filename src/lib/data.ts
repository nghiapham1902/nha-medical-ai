export const categories = [
  "Thiết bị phòng thí nghiệm",
  "Vật tư y tế",
  "Thiết bị y tế",
  "Dụng cụ xét nghiệm",
  "Hóa chất",
  "Thiết bị bảo hộ",
];
export type ProductMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; title: string; poster?: string };
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  image: string;
  media?: ProductMedia[];
  stock: boolean;
  popular: number;
  description: string;
};
const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;
export const labImage = photo("photo-1579154204601-01588f351e67");
export const products: Product[] = [
  {
    id: "NHA-001",
    slug: "kinh-hien-vi-quang-hoc",
    name: "Kính hiển vi quang học",
    category: categories[0],
    brand: "Chưa xác định",
    price: 12500000,
    image: "/images/microscope-banner.jpg",
    stock: true,
    popular: 98,
    description:
      "Nhóm thiết bị quan sát mẫu trong phòng thí nghiệm. Cấu hình, hãng sản xuất và phụ kiện sẽ được xác nhận theo nhu cầu thực tế.",
  },
  {
    id: "NHA-002",
    slug: "may-ly-tam-phong-thi-nghiem",
    name: "Máy ly tâm phòng thí nghiệm",
    category: categories[0],
    brand: "Chưa xác định",
    price: 18900000,
    image: labImage,
    stock: true,
    popular: 95,
    description:
      "Thiết bị phục vụ quy trình tách mẫu. Vui lòng yêu cầu tư vấn để lựa chọn cấu hình phù hợp với quy trình của đơn vị.",
  },
  {
    id: "NHA-003",
    slug: "bo-dung-cu-thuy-tinh",
    name: "Bộ dụng cụ thủy tinh thí nghiệm",
    category: categories[3],
    brand: "Chưa xác định",
    price: 850000,
    image: photo("photo-1602052577122-f73b9710adba"),
    stock: true,
    popular: 90,
    description:
      "Nhóm dụng cụ chứa và thao tác mẫu cho phòng thí nghiệm. Danh sách dụng cụ cụ thể cần được xác nhận khi báo giá.",
  },
  {
    id: "NHA-004",
    slug: "gang-tay-dung-mot-lan",
    name: "Găng tay dùng một lần",
    category: categories[1],
    brand: "Chưa xác định",
    price: 95000,
    image: photo("photo-1583947215259-38e31be8751f"),
    stock: true,
    popular: 92,
    description:
      "Vật tư bảo hộ dùng một lần. Chất liệu, kích cỡ và quy cách đóng gói cần được xác nhận với nhà cung cấp.",
  },
  {
    id: "NHA-005",
    slug: "thiet-bi-theo-doi-suc-khoe",
    name: "Thiết bị theo dõi sức khỏe",
    category: categories[2],
    brand: "Chưa xác định",
    price: 1450000,
    image: photo("photo-1576091160399-112ba8d25d1d"),
    stock: false,
    popular: 80,
    description:
      "Nhóm thiết bị theo dõi sức khỏe. Liên hệ để được cung cấp model, xuất xứ và hướng dẫn sử dụng chính thức.",
  },
  {
    id: "NHA-006",
    slug: "hoa-chat-phong-thi-nghiem",
    name: "Hóa chất phòng thí nghiệm",
    category: categories[4],
    brand: "Chưa xác định",
    price: 450000,
    image: photo("photo-1532187863486-abf9dbad1b69"),
    stock: false,
    popular: 70,
    description:
      "Danh mục minh họa hóa chất phòng thí nghiệm. Chỉ xác nhận sản phẩm sau khi kiểm tra mục đích sử dụng và tài liệu an toàn.",
  },
  {
    id: "NHA-007",
    slug: "trang-phuc-bao-ho",
    name: "Trang phục bảo hộ",
    category: categories[5],
    brand: "Chưa xác định",
    price: 180000,
    image: photo("photo-1584483766114-2cea6facdf57"),
    stock: true,
    popular: 75,
    description:
      "Nhóm trang phục bảo hộ cho môi trường làm việc chuyên môn. Tiêu chuẩn áp dụng được xác nhận bằng hồ sơ sản phẩm thực tế.",
  },
  {
    id: "NHA-008",
    slug: "dung-cu-lay-mau",
    name: "Dụng cụ lấy mẫu xét nghiệm",
    category: categories[3],
    brand: "Chưa xác định",
    price: 250000,
    image: labImage,
    stock: true,
    popular: 88,
    description:
      "Nhóm dụng cụ hỗ trợ lấy mẫu. Chủng loại, điều kiện bảo quản và quy cách sẽ được tư vấn riêng.",
  },
];
export const articles = [
  {
    slug: "lua-chon-thiet-bi-phong-thi-nghiem",
    title: "Những điều cần cân nhắc khi lựa chọn thiết bị phòng thí nghiệm",
    category: "Kiến thức chuyên ngành",
    date: "18/09/2026",
    image: labImage,
    excerpt:
      "Từ nhu cầu sử dụng đến dịch vụ hậu mãi: xây dựng danh sách yêu cầu trước khi đầu tư thiết bị.",
  },
  {
    slug: "quan-ly-vat-tu-y-te",
    title: "Quản lý vật tư y tế: bắt đầu từ một quy trình rõ ràng",
    category: "Cẩm nang",
    date: "15/09/2026",
    image: photo("photo-1576091160399-112ba8d25d1d"),
    excerpt:
      "Gợi ý tổ chức danh mục, theo dõi tồn kho và lưu trữ hồ sơ sản phẩm cho đơn vị của bạn.",
  },
  {
    slug: "khong-gian-phong-thi-nghiem",
    title: "Không gian khoa học, nền tảng cho những bước tiến mới",
    category: "Góc nhìn",
    date: "10/09/2026",
    image: photo("photo-1532187863486-abf9dbad1b69"),
    excerpt:
      "Một không gian có tổ chức giúp các nhóm phối hợp và quản lý thiết bị hiệu quả hơn.",
  },
];
export const money = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n,
  );
