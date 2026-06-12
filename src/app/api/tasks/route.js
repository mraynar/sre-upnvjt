import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { user, task, _TaskRoles, notification } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = parseInt(session.user.id);
    const authUser = await db.query.user.findFirst({ where: eq(user.id, userId) });

    if (!authUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const url = new URL(req.url);
    const viewAs = url.searchParams.get("viewAs"); // "assignedToMe" or "createdByme"

    let tasks = [];
    if (viewAs === "createdByme") {
      const fetchedTasks = await db.query.task.findMany({
        where: eq(task.assignedById, userId),
        with: { 
          targetRoles: { with: { role: true } },
          reports: { orderBy: (reports, { desc }) => [desc(reports.createdAt)] }
        },
        orderBy: (task, { desc }) => [desc(task.createdAt)],
      });
      tasks = fetchedTasks.map(t => ({ ...t, targetRoles: (t.targetRoles || []).map(tr => tr?.role).filter(Boolean) }));
    } else {
      // default: assigned to me (role based)
      if (!authUser.roleId) return NextResponse.json({ tasks: [] });
      const taskIdsWithRole = await db.select({ id: _TaskRoles.B }).from(_TaskRoles).where(eq(_TaskRoles.A, authUser.roleId));
      const ids = taskIdsWithRole.map(r => r.id);
      
      if (ids.length > 0) {
        const fetchedTasks = await db.query.task.findMany({
          where: inArray(task.id, ids),
          with: { 
            assignedBy: { columns: { name: true, positionName: true } },
            targetRoles: { with: { role: true } },
            reports: { orderBy: (reports, { desc }) => [desc(reports.createdAt)] }
          },
          orderBy: (task, { desc }) => [desc(task.createdAt)],
        });
        tasks = fetchedTasks.map(t => ({ ...t, targetRoles: (t.targetRoles || []).map(tr => tr?.role).filter(Boolean) }));
      }
    }

    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = parseInt(session.user.id);
    const authUser = await db.query.user.findFirst({ where: eq(user.id, userId), with: { role: true } });
    if (!authUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Check permission from Role JSON
    const permissions = authUser.role?.permissions || {};
    const hasTaskCreatePermission = Array.isArray(permissions.tasks) && permissions.tasks.includes('create');
    const canCreateTask = authUser.role?.name === 'SUPER_ADMIN' || hasTaskCreatePermission;
    
    if (!canCreateTask) return NextResponse.json({ error: "Forbidden: You don't have permission to assign tasks" }, { status: 403 });

    const body = await req.json();
    const { title, description, targetRoleIds, deadline, requireWeeklyReport } = body;

    if (!title || !targetRoleIds || targetRoleIds.length === 0 || !deadline) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const [result] = await db.insert(task).values({
      title,
      description: description || "",
      departmentId: authUser.departmentId || 1, // Fallback if admin
      assignedById: userId,
      deadline: new Date(deadline),
      requireWeeklyReport: requireWeeklyReport || false,
    });
    
    const taskId = result.insertId;
    
    await db.insert(_TaskRoles).values(
      targetRoleIds.map(id => ({ A: parseInt(id), B: taskId }))
    );
    
    const newTask = { id: taskId, title };

    // Create Notifications for all users in the assigned roles
    const targetUsers = await db.query.user.findMany({
      where: inArray(user.roleId, targetRoleIds.map(id => parseInt(id))),
      columns: { id: true }
    });

    if (targetUsers.length > 0) {
      await db.insert(notification).values(targetUsers.map(u => ({
        userId: u.id,
        title: "Tugas Baru",
        message: `${authUser.name} telah memberikan tugas baru: ${title}`,
        linkUrl: `/dashboard/tasks`
      })));
    }

    return NextResponse.json({ message: "Task created successfully", task: newTask }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/tasks] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
