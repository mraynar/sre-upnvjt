"use server";

import db from "@/lib/prisma";
import { attendanceSession, attendance } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createAttendanceSession(data) {
  try {
    const { title, date, createdById, projectId } = data;
    const [result] = await db.insert(attendanceSession).values({
      title,
      date: new Date(date),
      createdById: parseInt(createdById),
      projectId: projectId ? parseInt(projectId) : null
    });
    revalidatePath("/attendance");
    revalidatePath("/dashboard");
    return { success: true, data: { id: result.insertId, title } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function closeAttendanceSession(id) {
  try {
    await db.update(attendanceSession)
      .set({ isActive: false })
      .where(eq(attendanceSession.id, parseInt(id)));
      
    revalidatePath("/attendance");
    revalidatePath("/dashboard");
    return { success: true, data: { id: parseInt(id) } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteAttendanceSession(id) {
  try {
    await db.delete(attendanceSession).where(eq(attendanceSession.id, parseInt(id)));
    revalidatePath("/attendance");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function submitAttendance(data) {
  try {
    const { sessionId, userId, status, proofUrl } = data;
    
    const session = await db.query.attendanceSession.findFirst({ where: eq(attendanceSession.id, parseInt(sessionId)) });
    if (!session || !session.isActive) {
      return { success: false, error: "Attendance session is no longer active." };
    }

    await db.insert(attendance).values({
      sessionId: parseInt(sessionId),
      userId: parseInt(userId),
      status,
      proofUrl: proofUrl || null,
      date: new Date()
    }).onDuplicateKeyUpdate({
      set: {
        status,
        proofUrl: proofUrl || null,
        date: new Date()
      }
    });
    
    revalidatePath("/attendance");
    revalidatePath("/dashboard");
    return { success: true, data: { sessionId: parseInt(sessionId), userId: parseInt(userId) } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
