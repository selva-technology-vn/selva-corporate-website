export default function Loading() {
  return (
    <main className="route-loading" aria-live="polite" aria-busy="true">
      <div className="route-loading-mark" />
      <p>Đang tải nội dung...</p>
    </main>
  );
}
