import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { attendance, user, attendanceSession } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import AbsensiClient from "./AbsensiClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Absensi & Kehadiran | SRE Portal",
  description: "Pantau riwayat absensi dan statistik kehadiran Anda di SRE UPNVJT.",
};

export default async function MemberAbsensiPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userRecord = await db.query.user.findFirst({
    where: eq(user.id, parseInt(session.user.id)),
    with: { role: true }
  });

  const allSessions = await db.query.attendanceSession.findMany({
    orderBy: [desc(attendanceSession.date)],
  });

  const validSessions = allSessions.filter(s => {
    if (s.isForAllRoles) return true;
    const roles = s.targetRoleIds || [];
    return roles.includes(userRecord.roleId);
  });

  // Fetch only this member's attendance history
  const records = await db.query.attendance.findMany({
    where: eq(attendance.memberId, parseInt(session.user.id)),
    orderBy: [desc(attendance.createdAt)],
    with: {
      session: true
    }
  });

  return <AbsensiClient initialAttendance={records} validSessions={validSessions} userRoleName={userRecord?.role?.name || "Member"} />;
}
