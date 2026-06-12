import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { user, task, taskReport, notification } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = parseInt(session.user.id);
    const body = await req.json();
    const { taskId, reportText } = body;

    if (!taskId || !reportText) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const foundTask = await db.query.task.findFirst({ where: eq(task.id, parseInt(taskId)), with: { targetRoles: true } });
    if (!foundTask) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    
    // Check if user has permission to report (needs to check if user role is in targetRoles)
    const authUser = await db.query.user.findFirst({ where: eq(user.id, userId) });
    const isTargetRole = foundTask.targetRoles.some(r => r.A === authUser?.roleId);
    if (!isTargetRole) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [result] = await db.insert(taskReport).values({
      taskId: parseInt(taskId),
      reportText
    });

    // Notify manager
    await db.insert(notification).values({
      userId: foundTask.assignedById,
      title: "Laporan Mingguan Baru",
      message: `${session.user.name} mengirim laporan untuk tugas: ${foundTask.title}`,
      linkUrl: `/dashboard/tasks`
    });

    return NextResponse.json({ message: "Report submitted", report: { id: result.insertId, taskId: parseInt(taskId) } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
