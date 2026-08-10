import { HardNavigationLink } from "@/app/_components/hard-navigation-link";
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
            <HardNavigationLink className="button" href="/">Về trang chủ</HardNavigationLink>
            <HardNavigationLink className="button button-outline" href="/contact">Liên hệ SELVA</HardNavigationLink>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
