import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SELVA | Giải pháp công nghệ theo nhu cầu thực tế",
    template: "%s | SELVA",
  },
  description:
    "SELVA phát triển website, cổng thông tin, LMS và hệ thống phần mềm theo yêu cầu cho tổ chức và doanh nghiệp.",
  icons: {
    icon: "/brand/selva-app-icon.jpg",
    shortcut: "/brand/selva-app-icon.jpg",
    apple: "/brand/selva-app-icon.jpg",
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A1E3F",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const validGaId = gaId && /^G-[A-Z0-9]+$/.test(gaId) ? gaId : null;
  return (
    <html lang="vi">
      <body>
        {children}
        {validGaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${validGaId}`} strategy="afterInteractive" />
            <Script id="selva-ga4" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${validGaId}', { anonymize_ip: true });
            `}</Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
