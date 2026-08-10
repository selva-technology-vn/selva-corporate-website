import Image from "next/image";
import { HardNavigationLink } from "@/app/_components/hard-navigation-link";
import { navItems, type SiteSettings } from "@/content/site";

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <HardNavigationLink className="brand-link" href="/" aria-label="SELVA - Trang chủ">
          <Image
            src={settings.logoUrl}
            width={600}
            height={215}
            priority
            alt="SELVA Technology Company"
          />
        </HardNavigationLink>

        <nav className="desktop-nav" aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <HardNavigationLink key={item.href} href={item.href}>
              {item.label}
            </HardNavigationLink>
          ))}
          <HardNavigationLink className="button button-small" href="/contact">
            Trao đổi dự án
          </HardNavigationLink>
        </nav>

        <details className="mobile-menu">
          <summary aria-label="Mở menu điều hướng">Menu</summary>
          <nav aria-label="Điều hướng trên thiết bị di động">
            {navItems.map((item) => (
              <HardNavigationLink key={item.href} href={item.href}>
                {item.label}
              </HardNavigationLink>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Image
            src={settings.footerLogoUrl}
            width={555}
            height={180}
            alt="SELVA Technology Company"
          />
          <p>
            Giải pháp phần mềm rõ ràng, có trách nhiệm và sẵn sàng phát triển
            cùng nhu cầu vận hành thực tế.
          </p>
        </div>

        <div>
          <h2>Khám phá</h2>
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <HardNavigationLink href={item.href}>{item.label}</HardNavigationLink>
              </li>
            ))}
            <li>
              <HardNavigationLink href="/privacy">Chính sách bảo mật</HardNavigationLink>
            </li>
          </ul>
        </div>

        <div>
          <h2>Liên hệ</h2>
          <ul>
            <li>
              <a href={`mailto:${settings.contactEmail}`}>
                {settings.contactEmail}
              </a>
            </li>
            <li>
              <a href={`tel:${settings.contactPhone.replace(/\s/g, "")}`}>
                {settings.contactPhone}
              </a>
            </li>
            {settings.legalDetailsApproved && settings.officeAddress ? (
              <li>{settings.officeAddress}</li>
            ) : null}
            {Object.entries(settings.socialLinks).map(([label, url]) =>
              url ? (
                <li key={label}>
                  <a href={url} target="_blank" rel="noreferrer">
                    {label}
                  </a>
                </li>
              ) : null,
            )}
          </ul>
        </div>
      </div>

      <div className="shell footer-bottom">
        <p>
          © {new Date().getFullYear()} SELVA. Thông tin pháp lý sẽ được cập nhật
          sau khi hoàn tất đăng ký doanh nghiệp.
        </p>
      </div>
    </footer>
  );
}

export function PageShell({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng
      </a>
      <SiteHeader settings={settings} />
      <main id="main-content">{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <HardNavigationLink className="arrow-link" href={href}>
      {children} <span aria-hidden="true">↗</span>
    </HardNavigationLink>
  );
}
