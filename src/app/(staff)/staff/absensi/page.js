import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { attendance, user, attendanceSession } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import AbsensiStaffClient from "./AbsensiStaffClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Presensi Staff | SRE Portal",
  description: "Pantau riwayat presensi Anda di SRE UPNVJT.",
};

export default async function StaffAbsensiPage() {
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
    let roles = s.targetRoleIds || [];
    if (typeof roles === 'string') {
      try { roles = JSON.parse(roles); } catch (e) {}
    }
    if (!Array.isArray(roles)) roles = [roles];
    return roles.map(r => String(r)).includes(String(userRecord.roleId));
  });

  // Fetch only this member's attendance history
  const records = await db.query.attendance.findMany({
    where: eq(attendance.memberId, parseInt(session.user.id)),
    orderBy: [desc(attendance.createdAt)],
    with: {
      session: true
    }
  });

  return <AbsensiStaffClient initialAttendance={records} validSessions={validSessions} userRoleName={userRecord?.role?.name || "Staff"} />;
}
