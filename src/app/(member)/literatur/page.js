import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { literatureItem, literatureCategory } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import LiteraturMemberClient from "./LiteraturMemberClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bank Literatur & Referensi | SRE Portal",
  description: "Akses jurnal, artikel, dan bank literatur referensi SRE UPNVJT.",
};

export default async function MemberLiteraturPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Fetch only published items
  const items = await db.query.literatureItem.findMany({
    where: eq(literatureItem.isPublished, true),
    with: {
      category: { columns: { id: true, name: true, imageUrl: true } },
    },
    orderBy: [desc(literatureItem.createdAt)],
  });

  // Fetch all categories
  const categories = await db.query.literatureCategory.findMany({
    orderBy: [asc(literatureCategory.name)],
  });

  return (
    <LiteraturMemberClient
      initialItems={items}
      categories={categories}
    />
  );
}
