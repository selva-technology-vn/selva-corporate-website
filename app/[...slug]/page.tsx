import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  AboutPage,
  ContactPage,
  PrivacyPage,
  ProcessPage,
  ProjectsPage,
  ServicePage,
  ServicesPage,
} from "@/app/_components/public-pages";
import { getPublicContent } from "@/lib/content-store";
import { absoluteUrl, getRequestOrigin } from "@/lib/seo";

type RouteProps = { params: Promise<{ slug: string[] }> };

const pageMeta: Record<string, { title: string; description: string }> = {
  about: {
    title: "Về SELVA",
    description: "Tìm hiểu cách SELVA tiếp cận các dự án phần mềm theo yêu cầu với trọng tâm là sự rõ ràng, chất lượng và khả năng phát triển lâu dài.",
  },
  services: {
    title: "Dịch vụ công nghệ",
    description: "Website, cổng thông tin, LMS, phần mềm theo yêu cầu, bảo trì và tư vấn CNTT cho tổ chức và doanh nghiệp.",
  },
  projects: {
    title: "Dự án & Case studies",
    description: "Khu vực dự án và case study được SELVA công bố theo quyền chia sẻ đã xác nhận.",
  },
  process: {
    title: "Quy trình làm việc",
    description: "Quy trình năm bước từ tiếp nhận nhu cầu, khóa scope, phát triển, kiểm thử đến triển khai và bàn giao.",
  },
  contact: {
    title: "Liên hệ",
    description: "Trao đổi nhu cầu website, LMS, cổng thông tin hoặc hệ thống phần mềm theo yêu cầu với SELVA.",
  },
  privacy: {
    title: "Chính sách bảo mật",
    description: "Cách SELVA thu thập, sử dụng và bảo vệ thông tin được gửi qua website.",
  },
};

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const path = slug.join("/");
  const content = await getPublicContent();
  const origin = await getRequestOrigin();

  if (slug[0] === "services" && slug[1]) {
    const service = content.services.find((item) => item.slug === slug[1]);
    if (!service) return {};
    return {
      title: service.title,
      description: service.summary,
      alternates: { canonical: absoluteUrl(origin, `/services/${service.slug}`) },
      openGraph: { title: `${service.title} | SELVA`, description: service.summary, type: "website", url: absoluteUrl(origin, `/services/${service.slug}`), images: [absoluteUrl(origin, content.settings.ogImageUrl)] },
      twitter: { card: "summary_large_image", title: `${service.title} | SELVA`, description: service.summary, images: [absoluteUrl(origin, content.settings.ogImageUrl)] },
    };
  }

  const meta = pageMeta[path];
  if (!meta) return {};
  return {
    ...meta,
    alternates: { canonical: absoluteUrl(origin, `/${path}`) },
    openGraph: { ...meta, type: "website", url: absoluteUrl(origin, `/${path}`), images: [absoluteUrl(origin, content.settings.ogImageUrl)] },
    twitter: { card: "summary_large_image", ...meta, images: [absoluteUrl(origin, content.settings.ogImageUrl)] },
  };
}

export default async function PublicRoute({ params }: RouteProps) {
  const { slug } = await params;
  const content = await getPublicContent();

  if (slug.length === 1) {
    switch (slug[0]) {
      case "about": return <AboutPage content={content} />;
      case "services": return <ServicesPage content={content} />;
      case "projects": return <ProjectsPage content={content} />;
      case "process": return <ProcessPage content={content} />;
      case "contact": return <ContactPage content={content} />;
      case "privacy": return <PrivacyPage content={content} />;
    }
  }

  if (slug.length === 2 && slug[0] === "services") {
    const service = content.services.find((item) => item.slug === slug[1]);
    if (service) return <ServicePage content={content} service={service} />;
  }

  notFound();
}
