import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { user, memberProfile, role, department, division, taskSubmission, quizSubmission } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import ProfilClient from "./ProfilClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Profil Anggota | SRE Portal",
  description: "Lihat profil keanggotaan SRE UPNVJT Anda, riwayat tugas, dan pencapaian kuis.",
};

export default async function MemberProfilPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userId = parseInt(session.user.id);

  // Fetch full user details with profile
  const [userInfo] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      npm: user.npm,
      positionName: user.positionName,
      profilePictureUrl: user.profilePictureUrl,
      roleName: role.name,
      departmentName: department.name,
      divisionName: division.name,
      xp: memberProfile.xp,
      level: memberProfile.level,
    })
    .from(user)
    .leftJoin(role, eq(user.roleId, role.id))
    .leftJoin(department, eq(user.departmentId, department.id))
    .leftJoin(division, eq(user.divisionId, division.id))
    .leftJoin(memberProfile, eq(user.id, memberProfile.userId))
    .where(eq(user.id, userId))
    .limit(1);

  if (!userInfo) redirect("/login");

  // Fetch recent task submissions
  const recentTasks = await db.query.taskSubmission.findMany({
    where: eq(taskSubmission.memberId, userId),
    with: {
      task: { columns: { id: true, title: true, rewardXp: true } },
    },
    orderBy: [desc(taskSubmission.submittedAt)],
    limit: 5,
  });

  // Fetch recent quiz submissions
  const recentQuizzes = await db.query.quizSubmission.findMany({
    where: eq(quizSubmission.memberId, userId),
    with: {
      quiz: { columns: { id: true, title: true, rewardXp: true } },
    },
    orderBy: [desc(quizSubmission.submittedAt)],
    limit: 5,
  });

  return (
    <ProfilClient
      user={userInfo}
      recentTasks={recentTasks}
      recentQuizzes={recentQuizzes}
    />
  );
}
