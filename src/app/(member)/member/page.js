import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { user, memberProfile, task, taskSubmission, attendance, pptModule, literatureItem, xpTransaction } from "@/db/schema";
import { eq, desc, asc, and } from "drizzle-orm";
import MemberDashboardClient from "./MemberDashboardClient";

export const dynamic = "force-dynamic";

export default async function MemberDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userIdInt = parseInt(session.user.id);

  // Fetch current user and profile
  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, userIdInt),
    with: {
      role: true,
      department: true,
    }
  });

  if (!currentUser) redirect("/login");

  let profile = await db.query.memberProfile.findFirst({
    where: eq(memberProfile.userId, userIdInt),
  });

  if (!profile) {
    const [newProfile] = await db.insert(memberProfile).values({
      userId: userIdInt,
      xp: 0,
      level: 1,
    }).returning();
    profile = newProfile;
  }

  // Fetch leaderboard to calculate rank
  const allProfiles = await db
    .select({
      userId: memberProfile.userId,
      xp: memberProfile.xp,
    })
    .from(memberProfile)
    .orderBy(desc(memberProfile.xp));

  const userRankIdx = allProfiles.findIndex(p => p.userId === userIdInt);
  const currentRank = userRankIdx !== -1 ? userRankIdx + 1 : allProfiles.length + 1;

  // Fetch all tasks and user's submissions
  const allTasks = await db.query.task.findMany({
    orderBy: [asc(task.deadline)],
    limit: 6
  });

  const submissions = await db.query.taskSubmission.findMany({
    where: eq(taskSubmission.memberId, userIdInt),
  });

  // Calculate completed tasks
  const completedTasksCount = submissions.filter(s => s.status === "APPROVED").length;

  // Calculate attendance logs and streak
  const attendanceLogs = await db.query.attendance.findMany({
    where: eq(attendance.memberId, userIdInt),
    orderBy: [desc(attendance.createdAt)],
  });

  const presentCount = attendanceLogs.filter(a => a.status === "PRESENT" || a.status === "LATE").length;

  // Fetch latest PPT module
  const latestPpt = await db.query.pptModule.findFirst({
    where: eq(pptModule.isPublished, true),
    orderBy: [desc(pptModule.createdAt)],
    with: {
      slides: true
    }
  });

  // Fetch latest literature item
  const latestLiterature = await db.query.literatureItem.findFirst({
    where: eq(literatureItem.isPublished, true),
    orderBy: [desc(literatureItem.createdAt)],
    with: {
      category: true
    }
  });

  // Fetch recent XP transactions
  const xpLogs = await db.query.xpTransaction.findMany({
    where: eq(xpTransaction.userId, userIdInt),
    orderBy: [desc(xpTransaction.createdAt)],
    limit: 5
  });

  return (
    <MemberDashboardClient
      user={currentUser}
      profile={profile}
      rank={currentRank}
      tasks={allTasks}
      submissions={submissions}
      completedTasksCount={completedTasksCount}
      presentCount={presentCount}
      latestPpt={latestPpt}
      latestLiterature={latestLiterature}
      xpLogs={xpLogs}
    />
  );
}
