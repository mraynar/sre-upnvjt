"use server";

import { db } from "@/lib/db";
import { user, project, article, attendanceSession, attendance, department, activity } from "@/db/schema";
import { eq, inArray, count, desc, and, notExists } from "drizzle-orm";

export async function getDashboardStats(role, departmentId, userId) {
  try {
    let stats = {};

    if (role === "SUPER_ADMIN") {
      const [{ value: totalUsers }] = await db.select({ value: count() }).from(user).where(eq(user.isActive, true));
      const [{ value: activeProjects }] = await db.select({ value: count() }).from(project).where(eq(project.status, "APPROVED"));
      const [{ value: publishedArticles }] = await db.select({ value: count() }).from(article).where(eq(article.isPublished, true));
      const [{ value: totalDepartments }] = await db.select({ value: count() }).from(department);

      stats = {
        totalUsers,
        activeProjects,
        publishedArticles,
        totalDepartments,
      };
    } else if (role === "DIRECTOR") {
      const [{ value: activeProjects }] = await db.select({ value: count() }).from(project).where(inArray(project.status, ["PENDING", "APPROVED"]));

      const [{ value: pendingApprovals }] = await db.select({ value: count() }).from(project).where(eq(project.status, "PENDING"));

      stats = {
        deptPerformance: "94%",
        activeProjects,
        pendingApprovals,
        upcomingMeetings: 2,
      };
    } else if (role === "MANAGER") {
      const [{ value: deptProjects }] = await db.select({ value: count() }).from(project).where(and(eq(project.departmentId, departmentId), inArray(project.status, ["PENDING", "APPROVED"])));

      stats = {
        teamTasks: 24,
        staffAttendance: "92%",
        projectProgress: `${deptProjects} Active`,
        pendingReviews: 3,
      };
    } else {
      stats = {
        myTasks: 5,
        myAttendance: "100%",
        upcomingEvents: 1,
        announcements: 2,
      };
    }

    const recentProjects = await db.query.project.findMany({
      limit: 3,
      orderBy: [desc(project.createdAt)],
      with: { department: true }
    });
    
    const recentArticles = await db.query.article.findMany({
      limit: 2,
      orderBy: [desc(article.createdAt)],
      with: { author: true }
    });

    const recentOrgActivities = await db.query.activity.findMany({
      limit: 2,
      orderBy: [desc(activity.createdAt)]
    });

    const recentActivities = [
      ...recentProjects.map(p => ({
        id: `proj-${p.id}`,
        title: `Project: ${p.title}`,
        desc: `Created for ${p.department.name}`,
        date: p.createdAt,
        type: "project"
      })),
      ...recentArticles.map(a => ({
        id: `art-${a.id}`,
        title: `Article: ${a.title}`,
        desc: `Drafted by ${a.author.name}`,
        date: a.createdAt,
        type: "article"
      })),
      ...recentOrgActivities.map(act => ({
        id: `act-${act.id}`,
        title: `Event: ${act.title}`,
        desc: `New organization activity`,
        date: act.createdAt,
        type: "event"
      }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 3);

    stats.recentActivities = recentActivities;

    // Calculate functional chart data (Projects + Articles + Activities per month for the current year)
    const currentYear = new Date().getFullYear();
    const monthlyData = new Array(12).fill(0);
    
    const allProjects = await db.select({ createdAt: project.createdAt }).from(project);
    const allArticles = await db.select({ createdAt: article.createdAt }).from(article);
    const allActivities = await db.select({ createdAt: activity.createdAt }).from(activity);
    
    allProjects.forEach(p => {
      if (p.createdAt && new Date(p.createdAt).getFullYear() === currentYear) {
        monthlyData[new Date(p.createdAt).getMonth()]++;
      }
    });
    allArticles.forEach(a => {
      if (a.createdAt && new Date(a.createdAt).getFullYear() === currentYear) {
        monthlyData[new Date(a.createdAt).getMonth()]++;
      }
    });
    allActivities.forEach(act => {
      if (act.createdAt && new Date(act.createdAt).getFullYear() === currentYear) {
        monthlyData[new Date(act.createdAt).getMonth()]++;
      }
    });

    // Convert to percentages (0-100) based on max activity
    const maxVal = Math.max(...monthlyData, 1);
    stats.chartData = monthlyData.map(val => Math.round((val / maxVal) * 100));
    stats.rawChartData = monthlyData;

    let pendingAttendance = [];
    if (userId) {
      // Find active sessions where the user has no attendance record
      pendingAttendance = await db.select({
        id: attendanceSession.id,
        title: attendanceSession.title,
        date: attendanceSession.date
      })
      .from(attendanceSession)
      .where(
        and(
          eq(attendanceSession.isActive, true),
          notExists(
            db.select().from(attendance).where(and(eq(attendance.sessionId, attendanceSession.id), eq(attendance.userId, parseInt(userId))))
          )
        )
      );
    }
    stats.pendingAttendance = pendingAttendance;

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "Failed to fetch dashboard statistics" };
  }
}
