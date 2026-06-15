import React from "react";
import LogsClient from "./LogsClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { user, project, article, activity } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "System Logs | SRE Portal",
};

export default async function LogsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const currentUser = await db.query.user.findFirst({
    where: eq(user.email, session.user.email),
    with: { role: true }
  });

  // Allowed only for SUPER_ADMIN or ADMIN
  if (!currentUser || (currentUser.role?.name !== "SUPER_ADMIN" && currentUser.role?.name !== "ADMIN")) {
    redirect("/dashboard");
  }

  // Fetch all activities
  const recentProjects = await db.query.project.findMany({
    orderBy: [desc(project.createdAt)],
    with: { department: true }
  });
  
  const recentArticles = await db.query.article.findMany({
    orderBy: [desc(article.createdAt)],
    with: { author: true }
  });

  const recentOrgActivities = await db.query.activity.findMany({
    orderBy: [desc(activity.createdAt)]
  });

  const allLogs = [
    ...recentProjects.map(p => ({
      id: `proj-${p.id}`,
      title: `Project Created: ${p.title}`,
      desc: `Created for ${p.department?.name || 'Department'} - Status: ${p.status}`,
      date: p.createdAt,
      type: "project",
      user: "System"
    })),
    ...recentArticles.map(a => ({
      id: `art-${a.id}`,
      title: `Article Drafted: ${a.title}`,
      desc: `Drafted by ${a.author?.name || "Unknown"}`,
      date: a.createdAt,
      type: "article",
      user: a.author?.name || "Unknown"
    })),
    ...recentOrgActivities.map(act => ({
      id: `act-${act.id}`,
      title: `Event Published: ${act.title}`,
      desc: `New organization activity added to the CMS`,
      date: act.createdAt,
      type: "event",
      user: "System"
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return <LogsClient logs={allLogs} />;
}
