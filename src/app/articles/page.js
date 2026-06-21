import React from "react";
import ContentPublicClient from "./ContentPublicClient";
import { getPublicContent } from "@/app/actions/contentActions";

export const metadata = {
  title: "Articles & News | SRE UPNVJT",
  description: "Read the latest news, updates, and research from SRE UPN Veteran Jawa Timur.",
};

export const dynamic = "force-dynamic";

export default async function PublicContentPage() {
  const result = await getPublicContent();
  const articles = result.success ? result.data : [];

  return <ContentPublicClient initialArticles={articles} />;
}
