import React from "react";
import prisma from "@/lib/prisma";
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

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { role: true }
  });

  if (!currentUser) redirect("/login");

  const articles = await prisma.article.findMany({
    include: {
      author: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <ArticlesClient initialArticles={articles} currentUser={currentUser} />
  );
}
