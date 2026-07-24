import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { hasAccess } from "@/lib/permissions";
import { db } from "@/lib/db";
import { attendance, attendanceSession, user } from "@/db/schema";
import { desc, asc, eq } from "drizzle-orm";
import AttendanceClient from "./AttendanceClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Attendance Management | SRE Portal",
  description: "Kelola absensi kehadiran pengurus dan anggota SRE UPNVJT.",
};

export default async function AttendanceAdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");
  if (!hasAccess(session.user, "attendance", "read")) {
    redirect("/dashboard");
  }

  // Fetch all attendance logs with member and session details
  const records = await db.query.attendance.findMany({
    with: {
      member: { columns: { id: true, name: true, npm: true } },
      session: true,
    },
    orderBy: [desc(attendance.createdAt)],
  });

  // Fetch active users (members list)
  const members = await db.query.user.findMany({
    where: eq(user.isActive, true),
    orderBy: [asc(user.name)],
    columns: { id: true, name: true, npm: true },
  });

  // Fetch attendance sessions
  const sessions = await db.query.attendanceSession.findMany({
    orderBy: [desc(attendanceSession.date)],
    with: {
      createdBy: { columns: { id: true, name: true } },
    },
  });

  return (
    <AttendanceClient
      initialAttendance={records}
      members={members}
      initialSessions={sessions}
      currentUser={session.user}
    />
  );
}
