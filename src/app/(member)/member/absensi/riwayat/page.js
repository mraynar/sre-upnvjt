import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { attendance, attendanceSession } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import RiwayatAbsensiClient from "./RiwayatAbsensiClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Riwayat Presensi | SRE Portal",
  description: "Lihat seluruh riwayat presensi kamu di SRE UPNVJT.",
};

export default async function RiwayatAbsensiPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const memberId = parseInt(session.user.id);

  // Ambil semua attendance record milik user, beserta data sesi
  const records = await db.query.attendance.findMany({
    where: eq(attendance.memberId, memberId),
    orderBy: [desc(attendance.createdAt)],
    with: { session: true },
  });

  // Ambil semua sesi yang pernah ada (untuk kalkulasi sesi belum diisi)
  const allSessions = await db.query.attendanceSession.findMany({
    orderBy: [desc(attendanceSession.date)],
  });

  return <RiwayatAbsensiClient records={records} allSessions={allSessions} />;
}
