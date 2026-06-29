import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { hasAccess } from "@/lib/permissions";
import { db } from "@/lib/db";
import { attendance, user } from "@/db/schema";
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

  // Fetch all attendance logs
  const records = await db.query.attendance.findMany({
    with: {
      member: { columns: { id: true, name: true, npm: true } },
    },
    orderBy: [desc(attendance.date)],
  });

  // Fetch active users (members list) for add dropdown
  const members = await db.query.user.findMany({
    where: eq(user.isActive, true),
    orderBy: [asc(user.name)],
    columns: { id: true, name: true, npm: true },
  });

  return (
    <AttendanceClient
      initialAttendance={records}
      members={members}
      currentUser={session.user}
    />
  );
}
