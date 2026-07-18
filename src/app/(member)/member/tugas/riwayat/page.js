import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { task, taskSubmission } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import RiwayatTugasClient from "./RiwayatTugasClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Riwayat Tugas | SRE Portal",
  description: "Pantau seluruh riwayat pengumpulan tugas dan status persetujuan kamu di SRE UPNVJT.",
};

export default async function RiwayatTugasPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const memberId = parseInt(session.user.id);

  // Ambil semua submission milik user ini, beserta data task-nya
  const submissions = await db.query.taskSubmission.findMany({
    where: eq(taskSubmission.memberId, memberId),
    orderBy: [desc(taskSubmission.submittedAt)],
    with: { task: true },
  });

  return <RiwayatTugasClient submissions={submissions} />;
}
