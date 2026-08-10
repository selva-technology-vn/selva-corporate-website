# SELVA Website - Handover

## 1. Route map

| Route | Nội dung | CMS |
|---|---|---|
| `/` | Hero, services, values, process, projects, capabilities, CTA | Hero/settings/services/projects |
| `/about` | Định vị, cách tiếp cận, values | Nội dung nền trong source |
| `/services` | Tổng quan 5 dịch vụ | Services |
| `/services/*` | Problem, capabilities, deliverables, kickoff | Services |
| `/projects` | Case studies đã approved | Projects |
| `/process` | 5 bước và scope control | Nội dung nền trong source |
| `/contact` | Contact info + form | Settings |
| `/privacy` | Data/cookie policy | Source; review khi bật analytics |
| `/admin` | CMS được bảo vệ | Admin allowlist |
| `/robots.txt`, `/sitemap.xml` | SEO technical | Env + route definitions |

## 2. Founder admin guide

1. Truy cập `/admin` trên deployment và đăng nhập bằng email đã có trong `ADMIN_EMAILS`.
2. Tab Website & SEO: cập nhật hero, contact, legal, metadata, logo/OG và social links.
3. Không bật xác nhận pháp lý trước khi đối chiếu GCNĐKDN.
4. Tab Dịch vụ: chỉnh copy trong 5 dịch vụ launch; CMS không cho thêm dịch vụ ngoài scope.
5. Tab Dự án: tạo ở trạng thái Nháp, điền đủ fields và upload ảnh tối đa 5 MB.
6. Chỉ chọn Công khai khi đã có quyền dùng tên, hình, kết quả và live URL.
7. Sau thay đổi quan trọng, mở site ở tab ẩn danh và kiểm tra mobile + desktop.

## 3. Form liên hệ

Luồng chuẩn:

1. Browser validation.
2. Server validation + same-origin + honeypot + rate limit.
3. Lưu inquiry vào D1.
4. Gửi email qua Resend.
5. Nếu email lỗi nhưng D1 đã lưu, form báo đã lưu an toàn; `email_status=pending` phục vụ điều tra.

Trước launch bắt buộc gửi một inquiry thật và xác nhận cả record lẫn email.

## 4. Backup / restore

### Backup tối thiểu

- Source: Git repository do SELVA owner; tag mỗi production release.
- D1: export SQL hàng tuần và trước migration/release lớn.
- R2: đồng bộ ảnh project hàng tháng hoặc sau đợt cập nhật nội dung lớn.
- Env/account inventory: lưu trong password manager của công ty, không trong Git.

Giữ ít nhất 4 weekly backup và 3 monthly backup. Mỗi quý thử restore một bản vào staging.

### Restore order

1. Checkout/tag source đã biết tốt.
2. Tạo database/bucket staging mới.
3. Chạy migration đúng version.
4. Import D1 backup.
5. Restore R2 objects, giữ nguyên object key.
6. Cấu hình env, deploy private và test CMS/form.
7. Chỉ đổi traffic production sau khi acceptance pass.

## 5. Logging / monitoring

- Theo dõi Worker errors, D1/R2 usage và deployment logs trong dashboard.
- Theo dõi `email_status=pending` và Resend delivery/bounce logs.
- Bật thông báo quota/billing trên account do SELVA sở hữu.
- GA4/Search Console chỉ dùng account công ty; analytics không thay thế uptime/error monitoring.
- Không log contact message, token hoặc API key vào console.

## 6. Security operations

- Bật 2FA cho Cloudflare/Sites, Git, domain, Resend, Google.
- Mỗi quý review `ADMIN_EMAILS` và quyền repository/hosting.
- Rotate Resend key khi nghi ngờ lộ hoặc khi người phụ trách rời dự án.
- Chạy `npm audit` và cập nhật dependency có kiểm thử; không nâng Vinext major/beta tự động.
- Review upload quota và xóa asset không còn tham chiếu qua CMS workflow.

## 7. Packages / license

| Package trực tiếp | Version | License | Mục đích |
|---|---:|---|---|
| React / React DOM | 19.2.6 | MIT | UI/runtime |
| Drizzle ORM | 0.45.2 | Apache-2.0 | Schema/migration tooling |
| Vinext | 1.0.0-beta.2 | MIT | Next-compatible Worker runtime |
| Vite | 8.0.13 | MIT | Build |
| Cloudflare Vite plugin | 1.37.1 | MIT | Worker/D1/R2 local + build |
| TypeScript | 5.9.3 | Apache-2.0 | Type checking |
| ESLint | 9.39.4 | MIT | Code quality/accessibility rules |

Không có font thương mại, cracked theme/plugin hoặc paid UI asset. Brand raster lấy từ tài liệu founder cung cấp. Social card được tạo riêng cho project.

## 8. Acceptance status

Đã kiểm tra tự động: production build, lint, TypeScript, 12 route, 404, HTML language/metadata, legal/client-data gate, robots staging, sitemap, form invalid/cross-origin/honeypot, secret scan cơ bản.

Cần founder/external account để hoàn tất production gate:

- Visual review trên staging thật ở mobile/tablet/desktop và Safari/Edge.
- Admin login + CRUD với hosted D1/R2.
- Email Resend end-to-end.
- HTTPS/custom domain ownership.
- Final legal data, public indexing, GA4/Search Console.

## 9. Known limitations / TODO có điều kiện

- Thay logo raster bằng SVG gốc khi founder cung cấp asset vector đã duyệt.
- Blog, bilingual, founder/team profile và public case study chỉ triển khai qua change request.
- Chưa có SLA/warranty thương mại vì brief không có hợp đồng/timeline/budget; đề xuất chốt riêng trước production.
