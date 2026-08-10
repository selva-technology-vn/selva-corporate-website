# Hướng dẫn deploy miễn phí - SELVA

## Phương án đề xuất

Cloudflare Workers Free + D1 + R2 là lựa chọn phù hợp nhất cho Phase 1:

- Workers Free hiện có 100.000 request/ngày và D1 Free có 5 triệu row read/ngày, 100.000 row write/ngày.
- R2 Standard có free tier 10 GB-month, 1 triệu Class A và 10 triệu Class B operation/tháng, không tính egress Internet.
- HTTPS, CDN, DDoS protection và custom domain có sẵn trong hệ sinh thái Cloudflare.

Nguồn chính thức: [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [Workers limits](https://developers.cloudflare.com/workers/platform/limits/), [R2 pricing](https://developers.cloudflare.com/r2/pricing/).

Không chọn Vercel Hobby cho website công ty vì tài liệu Vercel quy định Hobby dành cho personal/non-commercial use. GitHub Pages cũng không phù hợp vì website này cần API, D1/R2, CMS và form server; GitHub nêu Pages không được dùng như free hosting để vận hành online business. Nguồn: [Vercel Hobby](https://vercel.com/docs/plans/hobby), [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

Free tier không phải SLA và giới hạn có thể thay đổi; kiểm tra lại các link trên trước production launch.

## A. Tạo staging private

1. Giữ `PUBLIC_INDEXING=false`.
2. Build và chạy toàn bộ test.
3. Publish qua Sites ở chế độ private. Hệ thống đọc `.openai/hosting.json`, tạo D1/R2 và chạy migration trong `dist/.openai/drizzle`.
4. Cấu hình `ADMIN_EMAILS` bằng email ChatGPT của founder.
5. Founder review toàn bộ trang, responsive, copy, legal state, project permissions và CMS.

Staging URL chỉ để review; không dùng làm website công ty chính thức và không gửi Search Console.

## B. Chuẩn bị production owner

Founder/SELVA phải là owner của:

- Git repository.
- Cloudflare/Sites master account, recovery email và 2FA.
- Domain registrar.
- Resend account và sender domain.
- Google Analytics/Search Console.

Không dùng tài khoản cá nhân của vendor làm owner dài hạn. Trước khi launch, test đăng nhập bằng account founder và loại bỏ quyền vendor không còn cần thiết.

## C. Cấu hình production

Server-only:

- `ADMIN_EMAILS`: danh sách email admin, phân tách bằng dấu phẩy.
- `RESEND_API_KEY`: API key chỉ có quyền gửi email cần thiết.
- `CONTACT_TO_EMAIL`: email nhận dự phòng trước khi CMS có settings.
- `CONTACT_FROM_EMAIL`: sender đã verify trên Resend.

Public/non-secret:

- `PUBLIC_INDEXING=false` tới phút founder approve launch.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` để trống cho tới khi Privacy Policy và property ownership đã duyệt.

Không đặt `RESEND_API_KEY` với prefix `NEXT_PUBLIC_`.

## D. Production launch checklist

1. Founder xác nhận legal name, địa chỉ, MST và phone theo hồ sơ chính thức.
2. Cập nhật CMS; chỉ sau đó bật checkbox pháp lý.
3. Xác minh domain và sender email trên Resend; gửi form thật và xác nhận email nhận được.
4. Gắn custom domain do SELVA sở hữu, kiểm tra HTTPS.
5. Bật `PUBLIC_INDEXING=true` và deploy lại.
6. Kiểm tra `/robots.txt`, `/sitemap.xml`, canonical và OG image trên domain thật.
7. Kết nối Search Console; gửi sitemap.
8. Nếu bật GA4, cập nhật Privacy Policy/cookie handling theo cấu hình thực tế rồi mới thêm measurement ID.
9. Test 360px, tablet và desktop trên Chrome/Safari/Edge; test menu, tất cả CTA và form.
10. Tạo backup baseline sau launch.

## E. Rollback

Nếu deploy mới lỗi, rollback về version production gần nhất trong dashboard. Không chạy migration phá dữ liệu. Nếu schema cần thay đổi không tương thích, tạo migration forward-fix và test trên staging trước.

## F. Khi vượt free tier

Cloudflare Free sẽ giới hạn/chặn phần vượt quota thay vì đảm bảo SLA. Theo dõi Usage hàng tuần trong ba tháng đầu. Chỉ nâng gói khi traffic, row operations hoặc storage tiến gần 70-80% quota; không thiết kế microservices/Kubernetes cho giai đoạn này.
