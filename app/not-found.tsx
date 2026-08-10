import Link from "next/link";
import { PageShell } from "@/app/_components/site-shell";
import { getPublicContent } from "@/lib/content-store";

export default async function NotFound() {
  const { settings } = await getPublicContent();
  return (
    <PageShell settings={settings}>
      <section className="not-found">
        <div className="shell">
          <p className="eyebrow">Lỗi 404</p>
          <h1>Trang bạn tìm không tồn tại.</h1>
          <p>Đường dẫn có thể đã thay đổi hoặc nội dung chưa được công bố.</p>
          <div className="hero-actions">
            <Link className="button" href="/">Về trang chủ</Link>
            <Link className="button button-outline" href="/contact">Liên hệ SELVA</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
