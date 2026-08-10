import type { Metadata } from "next";
import { HomePage } from "@/app/_components/public-pages";
import { getPublicContent } from "@/lib/content-store";
import { absoluteUrl, getRequestOrigin } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPublicContent();
  const origin = await getRequestOrigin();
  return {
    title: { absolute: settings.seoTitle },
    description: settings.seoDescription,
    alternates: { canonical: `${origin}/` },
    openGraph: {
      title: settings.seoTitle,
      description: settings.seoDescription,
      type: "website",
      url: `${origin}/`,
      images: [absoluteUrl(origin, settings.ogImageUrl)],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seoTitle,
      description: settings.seoDescription,
      images: [absoluteUrl(origin, settings.ogImageUrl)],
    },
  };
}

export default async function Home() {
  const content = await getPublicContent();
  return <HomePage content={content} />;
}
