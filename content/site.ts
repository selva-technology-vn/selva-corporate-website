export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  problem: string;
  capabilities: string[];
  deliverables: string[];
  accent: string;
};

export type Project = {
  slug: string;
  title: string;
  industry: string;
  problem: string;
  scope: string;
  solution: string;
  result: string;
  technologies: string[];
  imageUrl?: string;
  liveUrl?: string;
  publicationStatus: "draft" | "published";
};

export type SiteSettings = {
  heroTitle: string;
  heroCopy: string;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  legalName: string;
  taxId: string;
  legalDetailsApproved: boolean;
  seoTitle: string;
  seoDescription: string;
  logoUrl: string;
  footerLogoUrl: string;
  ogImageUrl: string;
  socialLinks: Record<string, string>;
};

export const defaultSettings: SiteSettings = {
  heroTitle: "Giải pháp công nghệ được thiết kế cho nhu cầu thực tế.",
  heroCopy:
    "SELVA phát triển website, cổng thông tin, LMS và hệ thống phần mềm theo yêu cầu, với trọng tâm là tính rõ ràng, khả năng vận hành và phát triển lâu dài.",
  contactEmail: "selvatech.company@gmail.com",
  contactPhone: "0399762351",
  officeAddress: "",
  legalName: "",
  taxId: "",
  legalDetailsApproved: false,
  seoTitle: "SELVA | Giải pháp website, LMS và phần mềm theo yêu cầu",
  seoDescription:
    "SELVA phát triển website, cổng thông tin, LMS và hệ thống phần mềm theo nhu cầu thực tế của tổ chức và doanh nghiệp.",
  logoUrl: "/brand/selva-logo.jpg",
  footerLogoUrl: "/brand/selva-logo-dark.jpg",
  ogImageUrl: "/og.png",
  socialLinks: {},
};

export const services: Service[] = [
  {
    slug: "web-portal",
    title: "Website & Web Portal Development",
    shortTitle: "Website & Portal",
    summary:
      "Website doanh nghiệp và cổng thông tin rõ ràng, nhanh, dễ quản trị trên mọi thiết bị.",
    problem:
      "Thông tin phân tán, trải nghiệm cũ hoặc quy trình xuất bản nội dung khiến tổ chức khó tạo niềm tin và vận hành hiệu quả.",
    capabilities: [
      "Website doanh nghiệp theo nhận diện",
      "Cổng thông tin và website theo yêu cầu",
      "Kiến trúc nội dung, responsive và SEO foundation",
      "Tích hợp biểu mẫu, API và hệ thống hiện có",
    ],
    deliverables: [
      "UI/UX và source code",
      "Khu vực quản trị nội dung",
      "Tài liệu vận hành và triển khai",
      "Kiểm thử responsive, accessibility và SEO",
    ],
    accent: "01",
  },
  {
    slug: "lms-elearning",
    title: "LMS & E-learning Solutions",
    shortTitle: "LMS & E-learning",
    summary:
      "Hệ thống học tập số được cấu hình theo mô hình đào tạo và phạm vi thực tế của từng đơn vị.",
    problem:
      "Đơn vị đào tạo cần quản lý học viên, nội dung và tiến độ tập trung nhưng giải pháp đóng gói thường không khớp quy trình.",
    capabilities: [
      "Quản lý tài khoản và học viên theo scope",
      "Nội dung học, video, quiz và tiến độ",
      "Tích hợp portal và hệ thống nghiệp vụ",
      "Báo cáo hoặc điểm danh theo yêu cầu dự án",
    ],
    deliverables: [
      "Phân tích quy trình đào tạo",
      "Thiết kế luồng học và quản trị",
      "Phát triển, kiểm thử và nhập liệu mẫu",
      "Hướng dẫn quản trị và bàn giao",
    ],
    accent: "02",
  },
  {
    slug: "custom-software",
    title: "Custom Software & Digital Systems",
    shortTitle: "Custom Software",
    summary:
      "Web application và hệ thống nội bộ được xây từ bài toán vận hành, không ép quy trình vào một mẫu có sẵn.",
    problem:
      "Quy trình thủ công, dữ liệu rời rạc hoặc công cụ sẵn có không đáp ứng cách doanh nghiệp đang vận hành.",
    capabilities: [
      "Web application và hệ thống nội bộ",
      "Workflow và phân quyền theo yêu cầu",
      "Tích hợp API, dữ liệu và hệ thống khác",
      "Tích hợp tính năng hỗ trợ bởi AI khi phù hợp",
    ],
    deliverables: [
      "Tài liệu scope và acceptance criteria",
      "Kiến trúc giải pháp phù hợp",
      "Phần mềm đã kiểm thử",
      "Tài liệu kỹ thuật và chuyển giao",
    ],
    accent: "03",
  },
  {
    slug: "maintenance-support",
    title: "Maintenance & Technical Support",
    shortTitle: "Bảo trì & Hỗ trợ",
    summary:
      "Giữ hệ thống ổn định, an toàn và có lộ trình nâng cấp minh bạch sau bàn giao.",
    problem:
      "Website hoặc phần mềm thiếu người theo dõi, chậm cập nhật và phát sinh lỗi làm gián đoạn công việc.",
    capabilities: [
      "Theo dõi và xử lý sự cố",
      "Cập nhật bảo mật và dependency",
      "Tối ưu hiệu năng theo dữ liệu vận hành",
      "Nâng cấp chức năng qua change request",
    ],
    deliverables: [
      "Phạm vi hỗ trợ và SLA theo thỏa thuận",
      "Nhật ký sự cố và thay đổi",
      "Bản sao lưu và quy trình khôi phục",
      "Báo cáo bảo trì định kỳ",
    ],
    accent: "04",
  },
  {
    slug: "it-consulting",
    title: "IT Consulting / Infrastructure & Data Services",
    shortTitle: "Tư vấn CNTT",
    summary:
      "Tư vấn kiến trúc, triển khai hạ tầng và dữ liệu phù hợp với quy mô, rủi ro và ngân sách dự án.",
    problem:
      "Đội ngũ cần một lộ trình công nghệ thực tế trước khi đầu tư vào hệ thống, hạ tầng hoặc tích hợp dữ liệu.",
    capabilities: [
      "Đánh giá hiện trạng và nhu cầu",
      "Đề xuất kiến trúc và phương án triển khai",
      "Hạ tầng, lưu trữ và xử lý dữ liệu theo scope",
      "Kế hoạch chuyển đổi và giảm rủi ro",
    ],
    deliverables: [
      "Báo cáo đánh giá",
      "Kiến trúc và lộ trình đề xuất",
      "Kế hoạch chi phí và vận hành",
      "Hỗ trợ triển khai theo thỏa thuận",
    ],
    accent: "05",
  },
];

export const publicProjects: Project[] = [];

export const processSteps = [
  {
    title: "Tiếp nhận nhu cầu",
    description: "Làm rõ mục tiêu, người dùng, hiện trạng và ràng buộc của dự án.",
  },
  {
    title: "Khóa phạm vi",
    description: "Thống nhất deliverables, acceptance criteria, timeline và trách nhiệm hai bên.",
  },
  {
    title: "Thiết kế & phát triển",
    description: "Triển khai theo từng phần có thể review, ghi nhận quyết định và kiểm soát thay đổi.",
  },
  {
    title: "Kiểm thử & rà soát",
    description: "Kiểm tra chức năng, responsive, accessibility, hiệu năng và bảo mật phù hợp scope.",
  },
  {
    title: "Triển khai & bàn giao",
    description: "Đưa hệ thống vào vận hành, chuyển giao quyền sở hữu, tài liệu và kế hoạch hỗ trợ.",
  },
];

export const navItems = [
  { href: "/about", label: "Về SELVA" },
  { href: "/services", label: "Dịch vụ" },
  { href: "/projects", label: "Dự án" },
  { href: "/process", label: "Quy trình" },
  { href: "/contact", label: "Liên hệ" },
];

export const technologyCapabilities = [
  "Web platforms",
  "Content systems",
  "LMS integration",
  "API integration",
  "Cloud deployment",
  "Data workflows",
];
