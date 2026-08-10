"use client";

import { HardNavigationLink } from "@/app/_components/hard-navigation-link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="error-page">
      <div>
        <p className="eyebrow">Đã có lỗi xảy ra</p>
        <h1>Trang chưa thể hiển thị lúc này.</h1>
        <p>Vui lòng thử lại. Nếu lỗi tiếp tục, bạn có thể quay về trang chủ hoặc liên hệ SELVA qua email.</p>
        <div className="hero-actions">
          <button className="button" onClick={reset}>Thử lại</button>
          <HardNavigationLink className="button button-outline" href="/">Về trang chủ</HardNavigationLink>
        </div>
      </div>
    </main>
  );
}
