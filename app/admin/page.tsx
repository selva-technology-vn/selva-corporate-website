import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPanel } from "@/app/admin/admin-panel";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { getAdminContent } from "@/lib/content-store";
import { bindings, getAdminEmails } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (bindings().ADMIN_ENABLED === "false") notFound();

  const user = await requireChatGPTUser("/admin");
  const allowlist = getAdminEmails();
  const isAuthorized = allowlist.includes(user.email.toLowerCase());

  if (!isAuthorized) {
    return (
      <main className="admin-access">
        <div>
          <p className="eyebrow">SELVA CMS</p>
          <h1>Không có quyền truy cập</h1>
          <p>
            Tài khoản <strong>{user.email}</strong> chưa nằm trong danh sách quản trị.
            Founder cần thêm email này vào biến môi trường <code>ADMIN_EMAILS</code>.
          </p>
          <Link className="button" href="/">Về website</Link>
        </div>
      </main>
    );
  }

  const content = await getAdminContent();
  return <AdminPanel initialContent={content} userEmail={user.email} />;
}
