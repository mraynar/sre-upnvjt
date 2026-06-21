"use server";

import { db } from "@/lib/db";
import { user, department, content, event } from "@/db/schema";
import { eq, count, desc } from "drizzle-orm";

export async function getDashboardStats(role, departmentId, userId) {
  try {
    const [{ value: totalUsers }] = await db.select({ value: count() }).from(user).where(eq(user.isActive, true));
    const [{ value: publishedArticles }] = await db.select({ value: count() }).from(content).where(eq(content.isPublished, true));
    const [{ value: totalDepartments }] = await db.select({ value: count() }).from(department);
    const [{ value: totalActivities }] = await db.select({ value: count() }).from(event);

    const stats = {
      totalUsers,
      publishedArticles,
      totalDepartments,
      totalActivities,
      recentActivities: [],
      chartData: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 90, 80],
      rawChartData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8],
      pendingAttendance: []
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "Failed to fetch dashboard statistics" };
  }
}
