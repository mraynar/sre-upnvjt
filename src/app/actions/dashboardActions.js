"use server";

import { db } from "@/lib/db";
import { user, department, content, event, taskSubmission } from "@/db/schema";
import { eq, count, desc } from "drizzle-orm";

export async function getDashboardStats(role, departmentId, userId) {
  try {
    const [{ value: totalUsers }] = await db.select({ value: count() }).from(user).where(eq(user.isActive, true));
    const [{ value: publishedArticles }] = await db.select({ value: count() }).from(content).where(eq(content.isPublished, true));
    const [{ value: totalDepartments }] = await db.select({ value: count() }).from(department);
    const [{ value: totalActivities }] = await db.select({ value: count() }).from(event);

    // Fetch last 5 articles
    const recentArticles = await db.query.content.findMany({
      orderBy: [desc(content.createdAt)],
      limit: 5,
    });

    // Fetch last 5 task submissions
    const recentSubmissions = await db.query.taskSubmission.findMany({
      orderBy: [desc(taskSubmission.submittedAt)],
      limit: 5,
      with: {
        member: { columns: { name: true } },
        task: { columns: { title: true } },
      },
    });

    // Format and combine
    const formattedArticles = recentArticles.map(art => ({
      id: `article-${art.id}`,
      title: art.title,
      desc: "Artikel baru diterbitkan ke modul publik.",
      type: "ARTICLE",
      date: art.createdAt,
    }));

    const formattedSubmissions = recentSubmissions.map(sub => ({
      id: `submission-${sub.id}`,
      title: sub.task?.title || "Penugasan Operasional",
      desc: `Laporan solusi disubmit oleh ${sub.member?.name || "anggota SRE"}.`,
      type: "SUBMISSION",
      date: sub.submittedAt,
    }));

    const recentActivities = [...formattedArticles, ...formattedSubmissions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Get 12-month publish counts
    const publishedList = await db.query.content.findMany({
      where: eq(content.isPublished, true),
      columns: { createdAt: true },
    });

    const chartData = Array(12).fill(0);
    publishedList.forEach(art => {
      const month = new Date(art.createdAt).getMonth();
      chartData[month]++;
    });

    const stats = {
      totalUsers,
      publishedArticles,
      totalDepartments,
      totalActivities,
      recentActivities,
      chartData,
      rawChartData: chartData,
      pendingAttendance: []
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "Failed to fetch dashboard statistics" };
  }
}

