import React from "react";
import { db } from "@/lib/db";
import { user, article } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import ArticlesClient from "./ArticlesClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "CMS Publikasi | SRE Portal",
};

export default async function ArticlesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const currentUser = await db.query.user.findFirst({
    where: eq(user.email, session.user.email),
    with: { role: true }
  });

  if (!currentUser) redirect("/login");

  const articles = await db.query.article.findMany({
    with: {
      author: true
    },
    orderBy: [desc(article.createdAt)]
  });

  return (
    <ArticlesClient initialArticles={articles} currentUser={currentUser} />
  );
}
