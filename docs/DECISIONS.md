# Decision log - SELVA Website

Ngày khóa quyết định: 10/08/2026. Nguồn ưu tiên: requirement handover v0.1 và brand board nhúng trong PDF.

## D-001 - Trạng thái launch

Website mặc định là staging/private. `PUBLIC_INDEXING=false`, robots chặn toàn bộ crawler. Chỉ bật index sau khi founder duyệt production gate.

## D-002 - Thông tin pháp lý

Tên pháp lý, địa chỉ và MST không hiển thị mặc định. CMS có checkbox xác nhận pháp lý; server chỉ cho bật khi đã nhập tên pháp lý và địa chỉ. Organization schema cũng chỉ xuất hiện sau gate này.

## D-003 - Nội dung không được suy diễn

- Không slogan chính thức; hero là value proposition theo draft đã cung cấp.
- Không số năm, số khách hàng, KPI hoặc claim “hàng đầu/số 1”.
- Không tên/logo/thông tin dự án thuộc hệ thống ĐHQG TP.HCM.
- Projects mặc định rỗng và có empty state trung thực.
- Không founder/team, bilingual, blog, video production, marketing, SaaS hoặc product riêng ở Phase 1.

## D-004 - Kiến trúc

Giữ một codebase Vinext/React chạy Cloudflare Worker-compatible ESM. UI public dùng component theo vai trò, không tách vụn theo từng section nhỏ. Nội dung xác nhận tập trung tại `content/site.ts`; nội dung founder thay đổi lưu trong D1 và merge với fallback.

## D-005 - CMS và phân quyền

`/admin` dùng dispatch-owned Sign in with ChatGPT. Authentication không đồng nghĩa authorization: mọi API write kiểm tra email trong `ADMIN_EMAILS` phía server. Không tin trạng thái client và không có secret ở bundle frontend.

## D-006 - Data model

D1 lưu settings, services, projects, inquiries, rate limits và metadata upload. R2 lưu ảnh. Query dùng prepared statement; index chỉ được tạo theo query thật. Migration được version hóa, không tạo schema ngầm khi runtime.

## D-007 - Contact form

Form dùng validation client + server, same-origin check, honeypot và giới hạn 5 yêu cầu/IP/giờ. Inquiry được lưu trước; Resend gửi email phía server. Nếu email tạm lỗi nhưng D1 lưu thành công, người dùng nhận trạng thái “đã lưu an toàn”, không nhận success giả về email.

## D-008 - Upload

Chỉ admin được upload. Giới hạn 5 MB; chấp nhận JPG/PNG/WebP/AVIF; kiểm tra cả MIME và magic bytes. Tên object là UUID. Media public chỉ được trả về nếu ảnh đang được một project trạng thái `published` tham chiếu, tránh truy cập draft qua URL đoán được.

## D-009 - SEO và analytics

Canonical/OG URL lấy từ request host nên dùng đúng staging/custom domain, không hard-code domain TBD. Sitemap có đủ route. GA4 chỉ được nạp khi có measurement ID; account phải do SELVA sở hữu. Không có marketing pixel.

## D-010 - Hosting miễn phí

Chọn Cloudflare Workers + D1 + R2 vì phù hợp trực tiếp kiến trúc và cho phép commercial website trong free tier. Không chọn Vercel Hobby vì gói này giới hạn personal/non-commercial; không chọn GitHub Pages vì thiếu server/database/CMS và tài liệu GitHub hạn chế dùng làm free hosting cho online business.

## D-011 - Brand assets

Logo raster được trích trực tiếp từ brand board trong tài liệu, không vẽ lại symbol. Social card được tạo riêng theo palette và value proposition, không tự nhận là logo/slogan. Khi founder cung cấp bộ SVG gốc, thay URL trong CMS và giữ nguyên concept.

## D-012 - Known constraints

- Vinext `1.0.0-beta.2` là runtime do Sites starter yêu cầu; giữ lockfile để tránh drift.
- Email end-to-end cần Resend key và sender domain đã verify.
- Admin end-to-end cần deployment có Sites auth headers.
- Visual browser QA tự động chưa thực hiện được trong phiên này vì không có browser binding; build/HTML/API/responsive CSS đã được kiểm tra tự động và cần founder review trên staging ở Gate 4.
