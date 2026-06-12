import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { user, task, notification } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const taskId = parseInt(id);
    const userId = parseInt(session.user.id);
    const body = await req.json();
    const { status, finalResult } = body;

    const foundTask = await db.query.task.findFirst({ where: eq(task.id, taskId), with: { targetRoles: true } });
    if (!foundTask) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    // Only assignee or creator or SUPER_ADMIN can update
    const authUser = await db.query.user.findFirst({ where: eq(user.id, userId), with: { role: true }});
    const isTargetRole = foundTask.targetRoles.some(r => r.A === authUser.roleId); // A is role id in _TaskRoles
    const canUpdate = isTargetRole || foundTask.assignedById === userId || authUser.role.name === 'SUPER_ADMIN';
    if (!canUpdate) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (finalResult !== undefined) updateData.finalResult = finalResult;

    if (Object.keys(updateData).length > 0) {
      await db.update(task).set(updateData).where(eq(task.id, taskId));
    }

    // Notify creator if assignee completed it
    if (status === "DONE" && isTargetRole) {
      await db.insert(notification).values({
        userId: foundTask.assignedById,
        title: "Tugas Selesai",
        message: `${session.user.name} telah menyelesaikan tugas: ${foundTask.title}`,
        linkUrl: `/dashboard/tasks`
      });
    }

    return NextResponse.json({ message: "Task updated", task: { id: taskId, ...updateData } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const taskId = parseInt(id);
    const userId = parseInt(session.user.id);
    const foundTask = await db.query.task.findFirst({ where: eq(task.id, taskId) });
    if (!foundTask) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    // Only creator or SUPER_ADMIN can delete
    const authUser = await db.query.user.findFirst({ where: eq(user.id, userId), with: { role: true }});
    const canDelete = foundTask.assignedById === userId || authUser.role.name === 'SUPER_ADMIN';
    if (!canDelete) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await db.delete(task).where(eq(task.id, taskId));

    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
