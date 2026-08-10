# SELVA Corporate Website

Website doanh nghiệp Vietnamese-first cho SELVA, phát triển theo bản yêu cầu v0.1 ngày 10/08/2026. Bản mặc định là staging-safe: chưa index, không hiển thị địa chỉ/tên pháp lý/MST, không công khai case study nếu founder chưa duyệt.

## Phạm vi đã triển khai

- 12 route public theo sitemap Phase 1.
- 5 nhóm dịch vụ, nội dung theo scope đã xác nhận.
- CMS cho hero, contact, pháp lý, SEO, social, logo/OG, services và projects.
- D1 cho nội dung/inquiry/rate limit; R2 cho ảnh project.
- Form liên hệ có validation hai lớp, honeypot, rate limit và lưu dự phòng.
- Email qua Resend ở server; không có API key trong frontend/repository.
- Auth quản trị bằng Sign in with ChatGPT và allowlist email phía server.
- SEO: unique metadata, canonical, Open Graph, X card, sitemap, robots và structured data có legal gate.
- Accessibility, reduced motion, loading/empty/error/404 states và responsive 360px trở lên.

## Yêu cầu môi trường

- Node.js `>=22.13.0`
- npm (dùng đúng `package-lock.json`)

## Chạy local

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Mở URL được in trong terminal. Nội dung public chạy với fallback đã xác nhận nếu local D1 chưa có dữ liệu. Khu vực `/admin` cần chạy qua môi trường Sites để nhận header đăng nhập hợp lệ.

## Kiểm tra chất lượng

```bash
npm run lint
npx tsc --noEmit
npm run test:build
```

`test:build` build output production rồi kiểm tra toàn bộ route public, nội dung pháp lý chưa duyệt, 404, sitemap, robots, validation/CSRF cơ bản và dấu hiệu secret trong source.

## Cấu trúc

```text
app/                    Pages, API routes, shared UI
content/site.ts         Nội dung fallback đã xác nhận
db/schema.ts            D1 schema
drizzle/                Migration có version
lib/                    Runtime, content store, SEO helpers
public/brand/           Web logo assets từ brand board được cung cấp
docs/                   Decision log, deploy và handover
tests/                  Integration tests trên production worker
```

## Database và storage

Logical bindings nằm trong `.openai/hosting.json`:

- `DB`: Cloudflare D1.
- `MEDIA`: Cloudflare R2.

Migration được tạo bằng `npm run db:generate` và được build vào `dist/.openai/drizzle/`. Không sửa migration đã deploy; thay schema rồi tạo migration mới.

## Environment variables

Xem `.env.example`. Giá trị thật chỉ cấu hình ở môi trường host hoặc `.env.local` đã ignore. Không commit `.env.local`.

## Tài liệu bàn giao

- [Quyết định kỹ thuật](docs/DECISIONS.md)
- [Hướng dẫn deploy](docs/DEPLOYMENT_GUIDE.md)
- [Hướng dẫn vận hành và bàn giao](docs/HANDOVER.md)
