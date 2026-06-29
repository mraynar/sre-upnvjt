import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { hasAccess } from "@/lib/permissions";
import { db } from "@/lib/db";
import { task, taskSubmission } from "@/db/schema";
import { desc, eq, count } from "drizzle-orm";
import TasksClient from "./TasksClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Task Management | SRE Portal",
  description: "Kelola penugasan dan hasil pengerjaan anggota SRE UPNVJT.",
};

export default async function TasksAdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");
  if (!hasAccess(session.user, "tasks", "read")) {
    redirect("/dashboard");
  }

  // Fetch tasks with submission counts
  const tasks = await db
    .select({
      id: task.id,
      title: task.title,
      description: task.description,
      rewardXp: task.rewardXp,
      deadline: task.deadline,
      createdById: task.createdById,
      createdAt: task.createdAt,
      submissionCount: count(taskSubmission.id),
    })
    .from(task)
    .leftJoin(taskSubmission, eq(taskSubmission.taskId, task.id))
    .groupBy(task.id)
    .orderBy(task.deadline);

  // Fetch all submissions
  const submissions = await db.query.taskSubmission.findMany({
    with: {
      member: { columns: { id: true, name: true } },
      task: { columns: { id: true, title: true, rewardXp: true } },
    },
    orderBy: [desc(taskSubmission.submittedAt)],
  });

  return (
    <TasksClient
      initialTasks={tasks}
      initialSubmissions={submissions}
      currentUser={session.user}
    />
  );
}
