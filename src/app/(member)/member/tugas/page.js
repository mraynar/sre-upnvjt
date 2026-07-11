import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { task, taskSubmission } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import TugasClient from "./TugasClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tugas Pengurus | SRE Portal",
  description: "Lihat daftar penugasan dan kumpulkan laporan hasil pengerjaan tugas Anda.",
};

export default async function MemberTugasPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Fetch all tasks
  const tasks = await db.query.task.findMany({
    orderBy: [asc(task.deadline)],
  });

  // Fetch only this member's submissions
  const submissions = await db.query.taskSubmission.findMany({
    where: eq(taskSubmission.memberId, parseInt(session.user.id)),
  });

  return (
    <TugasClient
      user={session.user}
      initialTasks={tasks}
      initialSubmissions={submissions}
    />
  );
}
