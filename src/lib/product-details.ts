type ProductDetails = {
  introduction: string;
  highlights: string[];
  specifications: [string, string][];
  configuration?: string[];
  warranty?: string;
  documents?: { name: string; href: string }[];
};

export const productDetails: Record<string, ProductDetails> = {
  "NHA-001": {
    introduction:
      "Kính hiển vi quang học sử dụng ánh sáng và hệ thấu kính để phóng đại hình ảnh mẫu trên tiêu bản. Đây là nhóm thiết bị phục vụ quan sát, giảng dạy và nghiên cứu trong phòng thí nghiệm. Lựa chọn cấu hình cần dựa trên loại mẫu và mức độ chi tiết muốn quan sát.",
    highlights: [
      "Quan sát hình thái và cấu trúc mẫu trên tiêu bản.",
      "Lựa chọn hệ vật kính, thị kính và nguồn sáng theo nhu cầu.",
      "Có thể yêu cầu cấu hình hỗ trợ camera khi cần lưu hình ảnh.",
    ],
    specifications: [
      ["Hệ quang học", "Quang học sử dụng ánh sáng"],
      ["Độ phóng đại / vật kính", "Chờ xác nhận theo model"],
      ["Đầu quan sát / thị kính", "Chờ xác nhận theo model"],
      ["Nguồn sáng", "Chờ xác nhận loại đèn và công suất"],
      ["Bàn sa và bộ tụ quang", "Chờ catalogue nhà sản xuất"],
      ["Kết nối camera", "Xác nhận theo cấu hình yêu cầu"],
    ],
  },
  "NHA-002": {
    introduction:
      "Máy ly tâm tạo chuyển động quay để hỗ trợ tách các thành phần trong mẫu theo đặc tính của chúng. Thiết bị được lựa chọn theo loại ống, thể tích mẫu và yêu cầu của quy trình chuẩn bị mẫu tại đơn vị.",
    highlights: [
      "Hỗ trợ công đoạn tách và chuẩn bị mẫu trong phòng thí nghiệm.",
      "Cần đối chiếu rotor với loại ống và thể tích sử dụng.",
      "Cấu hình làm lạnh được lựa chọn theo yêu cầu bảo quản mẫu.",
    ],
    specifications: [
      ["Tốc độ quay tối đa (rpm)", "Chờ xác nhận theo model"],
      ["Lực ly tâm tối đa (×g)", "Chờ xác nhận theo rotor"],
      ["Sức chứa rotor", "Chờ xác nhận số ống × thể tích"],
      ["Loại rotor", "Xác nhận theo loại mẫu và ống"],
      ["Dải hẹn giờ", "Chờ catalogue nhà sản xuất"],
      ["Kiểm soát nhiệt độ", "Xác nhận cấu hình thường / làm lạnh"],
      ["Khóa nắp / phát hiện mất cân bằng", "Chờ hồ sơ tính năng an toàn"],
    ],
  },
  "NHA-003": {
    introduction:
      "Bộ dụng cụ thủy tinh phục vụ chứa, pha và thao tác với mẫu trong phòng thí nghiệm. Thành phần bộ dụng cụ được lựa chọn theo quy trình làm việc, dung tích cần dùng và yêu cầu đo lường.",
    highlights: [
      "Lựa chọn từng dụng cụ hoặc bộ theo nhu cầu.",
      "Đối chiếu khả năng chịu nhiệt và tương thích hóa chất trước khi sử dụng.",
    ],
    specifications: [
      ["Thành phần bộ", "Xác nhận danh sách dụng cụ khi báo giá"],
      ["Chất liệu thủy tinh", "Chờ hồ sơ sản phẩm"],
      ["Dung tích (mL)", "Xác nhận theo từng dụng cụ"],
      ["Vạch chia / dung sai", "Chờ catalogue nhà sản xuất"],
      ["Giới hạn nhiệt độ", "Chờ hồ sơ sản phẩm"],
    ],
  },
  "NHA-004": {
    introduction:
      "Găng tay dùng một lần là vật tư hỗ trợ bảo vệ bàn tay khi thao tác. Cần lựa chọn chất liệu, kích cỡ và tiêu chuẩn phù hợp với môi trường sử dụng cụ thể.",
    highlights: [
      "Lựa chọn kích cỡ vừa tay để thuận tiện thao tác.",
      "Xác nhận chất liệu và tình trạng tiệt trùng theo mục đích sử dụng.",
    ],
    specifications: [
      ["Chất liệu", "Chờ xác nhận loại găng"],
      ["Kích cỡ", "Xác nhận theo yêu cầu"],
      ["Có bột / không bột", "Chờ hồ sơ sản phẩm"],
      ["Tiệt trùng", "Chờ hồ sơ sản phẩm"],
      ["Quy cách đóng gói", "Xác nhận số chiếc / hộp"],
    ],
  },
  "NHA-005": {
    introduction:
      "Nhóm thiết bị hỗ trợ theo dõi các chỉ số sức khỏe tùy theo chức năng của từng model. Cần xác định chỉ số cần đo, đối tượng và môi trường sử dụng trước khi lựa chọn thiết bị.",
    highlights: [
      "Lựa chọn theo chỉ số cần theo dõi.",
      "Đối chiếu phụ kiện, cách hiển thị và khả năng lưu kết quả theo model.",
    ],
    specifications: [
      ["Chỉ số theo dõi", "Chờ xác định loại thiết bị"],
      ["Dải đo / độ chính xác", "Chờ tài liệu model cụ thể"],
      ["Màn hình", "Chờ xác nhận theo model"],
      ["Nguồn điện / pin", "Chờ xác nhận theo model"],
      ["Bộ nhớ / kết nối", "Chờ xác nhận theo model"],
    ],
  },
  "NHA-006": {
    introduction:
      "Hóa chất phòng thí nghiệm được lựa chọn theo phương pháp phân tích và yêu cầu chất lượng của quy trình. Tên hóa chất, cấp độ tinh khiết và quy cách cần được xác định cụ thể khi gửi yêu cầu.",
    highlights: [
      "Đối chiếu tên hóa chất và mã CAS khi đặt hàng.",
      "Yêu cầu tài liệu SDS và chứng nhận phân tích phù hợp.",
    ],
    specifications: [
      ["Tên hóa chất / mã CAS", "Chờ xác định hóa chất cụ thể"],
      ["Độ tinh khiết / cấp chất lượng", "Xác nhận theo phương pháp sử dụng"],
      ["Nồng độ", "Chờ xác nhận sản phẩm"],
      ["Quy cách đóng gói", "Xác nhận khối lượng / thể tích"],
      ["Điều kiện bảo quản", "Theo SDS của sản phẩm cụ thể"],
    ],
  },
  "NHA-007": {
    introduction:
      "Trang phục bảo hộ hỗ trợ bảo vệ người sử dụng trong môi trường làm việc chuyên môn. Kiểu dáng, vật liệu và mức bảo vệ cần được đối chiếu với yêu cầu của từng công việc.",
    highlights: [
      "Lựa chọn kích cỡ phù hợp với người sử dụng.",
      "Xác nhận tiêu chuẩn bảo vệ bằng hồ sơ sản phẩm.",
    ],
    specifications: [
      ["Vật liệu", "Chờ hồ sơ sản phẩm"],
      ["Kích cỡ", "Xác nhận theo yêu cầu"],
      ["Kiểu dáng", "Chờ xác nhận mẫu sản phẩm"],
      ["Tiêu chuẩn bảo vệ", "Chờ chứng nhận sản phẩm"],
      ["Quy cách sử dụng / đóng gói", "Chờ hướng dẫn nhà sản xuất"],
    ],
  },
  "NHA-008": {
    introduction:
      "Dụng cụ lấy mẫu hỗ trợ thu nhận và chứa mẫu trước khi chuyển đến công đoạn xét nghiệm. Chủng loại cần phù hợp với mẫu cần thu và yêu cầu tiếp nhận của phòng xét nghiệm.",
    highlights: [
      "Lựa chọn dụng cụ theo loại mẫu và phương pháp xét nghiệm.",
      "Đối chiếu yêu cầu vận chuyển và bảo quản mẫu.",
    ],
    specifications: [
      ["Loại mẫu phù hợp", "Chờ xác nhận chủng loại dụng cụ"],
      ["Chất liệu / dung tích", "Chờ hồ sơ sản phẩm"],
      ["Chất phụ gia", "Xác nhận theo loại dụng cụ"],
      ["Tình trạng tiệt trùng", "Chờ hồ sơ sản phẩm"],
      ["Quy cách đóng gói", "Xác nhận khi báo giá"],
    ],
  },
};
