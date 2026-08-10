"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import type { Project, Service, SiteSettings } from "@/content/site";
import type { PublicContent } from "@/lib/content-store";

type Notice = { kind: "success" | "error" | "loading"; text: string } | null;

function lines(value: string): string[] {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function textLines(value: string[]): string {
  return value.join("\n");
}

async function updateContent(type: string, data: Record<string, unknown>) {
  const response = await fetch("/api/admin/content", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type, data }),
  });
  const result = (await response.json()) as { message?: string; error?: string };
  if (!response.ok) throw new Error(result.error ?? "Không thể lưu thay đổi.");
  return result.message ?? "Đã lưu thay đổi.";
}

export function AdminPanel({ initialContent, userEmail }: { initialContent: PublicContent; userEmail: string }) {
  const [settings, setSettings] = useState<SiteSettings>(initialContent.settings);
  const [services, setServices] = useState<Service[]>(initialContent.services);
  const [projects, setProjects] = useState<Project[]>(initialContent.projects);
  const [notice, setNotice] = useState<Notice>(null);
  const [activeTab, setActiveTab] = useState<"settings" | "services" | "projects">("settings");

  async function run(action: () => Promise<string>) {
    setNotice({ kind: "loading", text: "Đang lưu..." });
    try {
      setNotice({ kind: "success", text: await action() });
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "Đã có lỗi xảy ra." });
    }
  }

  async function saveSettings(event: FormEvent) {
    event.preventDefault();
    await run(() => updateContent("settings", settings as unknown as Record<string, unknown>));
  }

  function updateService(index: number, patch: Partial<Service>) {
    setServices((current) => current.map((service, itemIndex) => itemIndex === index ? { ...service, ...patch } : service));
  }

  async function saveService(index: number) {
    const service = services[index];
    await run(() => updateContent("service", {
      ...service,
      displayOrder: index,
      published: true,
    }));
  }

  function createProject() {
    setProjects((current) => [
      ...current,
      {
        slug: `du-an-${Date.now()}`,
        title: "Dự án mới",
        industry: "",
        problem: "",
        scope: "",
        solution: "",
        result: "",
        technologies: [],
        publicationStatus: "draft",
      },
    ]);
    setNotice(null);
  }

  function updateProject(index: number, patch: Partial<Project>) {
    setProjects((current) => current.map((project, itemIndex) => itemIndex === index ? { ...project, ...patch } : project));
  }

  async function uploadProjectImage(index: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setNotice({ kind: "loading", text: "Đang tải ảnh..." });
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error ?? "Không thể tải ảnh.");
      updateProject(index, { imageUrl: result.url });
      setNotice({ kind: "success", text: "Ảnh đã tải lên. Hãy lưu dự án để hoàn tất." });
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "Không thể tải ảnh." });
    }
  }

  async function saveProject(index: number) {
    const project = projects[index];
    await run(() => updateContent("project", { ...project, displayOrder: index }));
  }

  async function deleteProject(index: number) {
    const project = projects[index];
    if (!window.confirm(`Xóa dự án “${project.title}”? Thao tác này không thể hoàn tác.`)) return;
    await run(async () => {
      const message = await updateContent("deleteProject", { slug: project.slug });
      setProjects((current) => current.filter((_, itemIndex) => itemIndex !== index));
      return message;
    });
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">SELVA CMS</p>
          <h1>Quản trị nội dung</h1>
          <p>Đăng nhập với {userEmail}</p>
        </div>
        <div className="admin-header-actions">
          <Link className="button button-outline" href="/">Xem website</Link>
          <Link className="button" href="/signout-with-chatgpt?return_to=/">Đăng xuất</Link>
        </div>
      </header>

      <nav className="admin-tabs" aria-label="Khu vực quản trị">
        <button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>Website & SEO</button>
        <button className={activeTab === "services" ? "active" : ""} onClick={() => setActiveTab("services")}>Dịch vụ</button>
        <button className={activeTab === "projects" ? "active" : ""} onClick={() => setActiveTab("projects")}>Dự án</button>
      </nav>

      {notice ? <div className={`admin-notice ${notice.kind}`} role="status" aria-live="polite">{notice.text}</div> : null}

      {activeTab === "settings" ? (
        <form className="admin-panel" onSubmit={saveSettings}>
          <div className="admin-section-heading"><div><h2>Nội dung website</h2><p>Các trường pháp lý chỉ hiển thị khi bật xác nhận pháp lý.</p></div><button className="button" type="submit">Lưu cấu hình</button></div>
          <div className="admin-form-grid">
            <label className="wide">Tiêu đề hero<input value={settings.heroTitle} required maxLength={160} onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })} /></label>
            <label className="wide">Mô tả hero<textarea rows={4} value={settings.heroCopy} required maxLength={1000} onChange={(e) => setSettings({ ...settings, heroCopy: e.target.value })} /></label>
            <label>Email liên hệ<input type="email" value={settings.contactEmail} required onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} /></label>
            <label>Điện thoại<input value={settings.contactPhone} required onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })} /></label>
            <label className="wide">Địa chỉ văn phòng<input value={settings.officeAddress} onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })} /></label>
            <label>Tên pháp lý<input value={settings.legalName} onChange={(e) => setSettings({ ...settings, legalName: e.target.value })} /></label>
            <label>Mã số thuế<input value={settings.taxId} onChange={(e) => setSettings({ ...settings, taxId: e.target.value })} /></label>
            <label className="checkbox-label wide"><input type="checkbox" checked={settings.legalDetailsApproved} onChange={(e) => setSettings({ ...settings, legalDetailsApproved: e.target.checked })} /><span>Founder đã đối chiếu và duyệt thông tin pháp lý để công khai</span></label>
            <label className="wide">SEO title<input value={settings.seoTitle} required maxLength={160} onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })} /></label>
            <label className="wide">Meta description<textarea rows={3} value={settings.seoDescription} required maxLength={300} onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })} /></label>
            <label>Logo URL<input value={settings.logoUrl} required onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })} /></label>
            <label>Logo nền tối URL<input value={settings.footerLogoUrl} required onChange={(e) => setSettings({ ...settings, footerLogoUrl: e.target.value })} /></label>
            <label className="wide">Open Graph image URL<input value={settings.ogImageUrl} required onChange={(e) => setSettings({ ...settings, ogImageUrl: e.target.value })} /></label>
            <label>LinkedIn URL<input type="url" value={settings.socialLinks.LinkedIn ?? ""} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, LinkedIn: e.target.value } })} /></label>
            <label>Facebook URL<input type="url" value={settings.socialLinks.Facebook ?? ""} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, Facebook: e.target.value } })} /></label>
          </div>
        </form>
      ) : null}

      {activeTab === "services" ? (
        <section className="admin-panel">
          <div className="admin-section-heading"><div><h2>Dịch vụ</h2><p>Giữ đúng phạm vi launch đã được xác nhận.</p></div></div>
          <div className="admin-stack">
            {services.map((service, index) => (
              <details key={service.slug} className="admin-card" open={index === 0}>
                <summary>{service.title}</summary>
                <div className="admin-form-grid">
                  <label>Slug<input value={service.slug} readOnly /></label>
                  <label>Tiêu đề ngắn<input value={service.shortTitle} onChange={(e) => updateService(index, { shortTitle: e.target.value })} /></label>
                  <label className="wide">Tiêu đề đầy đủ<input value={service.title} onChange={(e) => updateService(index, { title: e.target.value })} /></label>
                  <label className="wide">Tóm tắt<textarea rows={3} value={service.summary} onChange={(e) => updateService(index, { summary: e.target.value })} /></label>
                  <label className="wide">Bài toán thường gặp<textarea rows={4} value={service.problem} onChange={(e) => updateService(index, { problem: e.target.value })} /></label>
                  <label>Mỗi năng lực một dòng<textarea rows={7} value={textLines(service.capabilities)} onChange={(e) => updateService(index, { capabilities: lines(e.target.value) })} /></label>
                  <label>Mỗi deliverable một dòng<textarea rows={7} value={textLines(service.deliverables)} onChange={(e) => updateService(index, { deliverables: lines(e.target.value) })} /></label>
                </div>
                <button className="button" type="button" onClick={() => saveService(index)}>Lưu dịch vụ</button>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "projects" ? (
        <section className="admin-panel">
          <div className="admin-section-heading"><div><h2>Dự án / Case studies</h2><p>Mặc định lưu nháp. Chỉ chọn công khai sau khi đã có quyền xuất bản.</p></div><button className="button" type="button" onClick={createProject}>Thêm dự án</button></div>
          {projects.length === 0 ? <div className="admin-empty"><p>Chưa có dự án trong CMS.</p><button className="button button-outline" type="button" onClick={createProject}>Tạo dự án đầu tiên</button></div> : null}
          <div className="admin-stack">
            {projects.map((project, index) => (
              <details key={`${project.slug}-${index}`} className="admin-card" open>
                <summary>{project.title} · {project.publicationStatus === "published" ? "Công khai" : "Nháp"}</summary>
                <div className="admin-form-grid">
                  <label>Slug<input value={project.slug} required pattern="[a-z0-9-]+" onChange={(e) => updateProject(index, { slug: e.target.value })} /></label>
                  <label>Ngành / loại khách hàng<input value={project.industry} required onChange={(e) => updateProject(index, { industry: e.target.value })} /></label>
                  <label className="wide">Tên dự án<input value={project.title} required onChange={(e) => updateProject(index, { title: e.target.value })} /></label>
                  <label>Bài toán<textarea rows={5} value={project.problem} required onChange={(e) => updateProject(index, { problem: e.target.value })} /></label>
                  <label>Phạm vi<textarea rows={5} value={project.scope} required onChange={(e) => updateProject(index, { scope: e.target.value })} /></label>
                  <label>Giải pháp<textarea rows={5} value={project.solution} required onChange={(e) => updateProject(index, { solution: e.target.value })} /></label>
                  <label>Kết quả / impact<textarea rows={5} value={project.result} required onChange={(e) => updateProject(index, { result: e.target.value })} /></label>
                  <label>Công nghệ, mỗi mục một dòng<textarea rows={5} value={textLines(project.technologies)} onChange={(e) => updateProject(index, { technologies: lines(e.target.value) })} /></label>
                  <label>Live URL (nếu được phép)<input type="url" value={project.liveUrl ?? ""} onChange={(e) => updateProject(index, { liveUrl: e.target.value })} /></label>
                  <label>Ảnh dự án (JPG/PNG/WebP/AVIF, tối đa 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => uploadProjectImage(index, e)} /></label>
                  <label>Image URL<input value={project.imageUrl ?? ""} readOnly /></label>
                  <label>Trạng thái<select value={project.publicationStatus} onChange={(e) => updateProject(index, { publicationStatus: e.target.value === "published" ? "published" : "draft" })}><option value="draft">Nháp - không công khai</option><option value="published">Công khai - đã có quyền xuất bản</option></select></label>
                </div>
                <div className="admin-card-actions"><button className="button" type="button" onClick={() => saveProject(index)}>Lưu dự án</button><button className="danger-button" type="button" onClick={() => deleteProject(index)}>Xóa dự án</button></div>
              </details>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
