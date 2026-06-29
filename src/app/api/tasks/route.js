import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { task, taskSubmission } from "@/db/schema";
import { desc, count, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
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

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, rewardXp, deadline } = body;

    if (!title || !description || !deadline) {
      return NextResponse.json({ error: "Judul, deskripsi, dan tenggat waktu wajib diisi" }, { status: 400 });
    }

    const [result] = await db.insert(task).values({
      title,
      description,
      rewardXp: rewardXp ? parseInt(rewardXp) : 0,
      deadline: new Date(deadline),
      createdById: session.user.id,
    }).returning();

    return NextResponse.json({ success: true, task: { ...result, submissionCount: 0 } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
