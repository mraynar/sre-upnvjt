"use server";

import prisma from "@/lib/prisma";

export async function getDashboardStats(role, departmentId, userId) {
  try {
    let stats = {};

    if (role === "SUPER_ADMIN") {
      const totalUsers = await prisma.user.count({
        where: { isActive: true },
      });

      const activeProjects = await prisma.project.count({
        where: {
          status: {
            in: ["PENDING", "APPROVED"],
          },
        },
      });

      const pendingReports = await prisma.project.count({
        where: {
          status: "PENDING",
        },
      });

      stats = {
        totalUsers,
        activeProjects,
        pendingReports,
        systemHealth: "99%",
      };
    } else if (role === "DIRECTOR") {
      const activeProjects = await prisma.project.count({
        where: {
          status: {
            in: ["PENDING", "APPROVED"],
          },
        },
      });

      const pendingApprovals = await prisma.project.count({
        where: {
          status: "PENDING",
        },
      });

      stats = {
        deptPerformance: "94%",
        activeProjects,
        pendingApprovals,
        upcomingMeetings: 2,
      };
    } else if (role === "MANAGER") {
      const deptProjects = await prisma.project.count({
        where: {
          departmentId: departmentId,
          status: {
            in: ["PENDING", "APPROVED"],
          },
        },
      });

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

    const recentProjects = await prisma.project.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { department: true }
    });
    
    const recentArticles = await prisma.article.findMany({
      take: 2,
      orderBy: { createdAt: "desc" },
      include: { author: true }
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
      }))
    ].sort((a, b) => b.date - a.date).slice(0, 5);

    stats.recentActivities = recentActivities;

    let pendingAttendance = [];
    if (userId) {
      pendingAttendance = await prisma.attendanceSession.findMany({
        where: {
          isActive: true,
          attendances: {
            none: {
              userId: parseInt(userId)
            }
          }
        },
        select: {
          id: true,
          title: true,
          date: true
        }
      });
    }
    stats.pendingAttendance = pendingAttendance;

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "Failed to fetch dashboard statistics" };
  }
}
