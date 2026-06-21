import React from "react";
import { db } from "@/lib/db";
import { content, user } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import ContentClient from "./ContentClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Content Management | SRE Portal",
};

export default async function ContentPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const currentUser = await db.query.user.findFirst({
    where: eq(user.email, session.user.email),
    with: { role: true }
  });

  const rawContents = await db.select({
    id: content.id,
    title: content.title,
    slug: content.slug,
    body: content.body,
    imageUrl: content.imageUrl,
    isPublished: content.isPublished,
    createdAt: content.createdAt,
    author: {
      name: user.name,
    }
  })
  .from(content)
  .leftJoin(user, eq(content.updatedById, user.id))
  .orderBy(desc(content.createdAt));

  const contentsData = rawContents.map(c => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    body: c.body,
    imageUrl: c.imageUrl,
    isPublished: c.isPublished,
    createdAt: c.createdAt,
    authorName: c.author?.name || "Unknown",
  }));

  return <ContentClient initialContents={contentsData} currentUser={currentUser} />;
}
