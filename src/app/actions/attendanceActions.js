"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createAttendanceSession(data) {
  try {
    const { title, date, createdById, projectId } = data;
    const session = await prisma.attendanceSession.create({
      data: {
        title,
        date: new Date(date),
        createdById: parseInt(createdById),
        projectId: projectId ? parseInt(projectId) : null
      }
    });
    revalidatePath("/attendance");
    revalidatePath("/dashboard");
    return { success: true, data: session };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function closeAttendanceSession(id) {
  try {
    const session = await prisma.attendanceSession.update({
      where: { id: parseInt(id) },
      data: { isActive: false }
    });
    revalidatePath("/attendance");
    revalidatePath("/dashboard");
    return { success: true, data: session };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteAttendanceSession(id) {
  try {
    await prisma.attendanceSession.delete({ where: { id: parseInt(id) } });
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
    
    const session = await prisma.attendanceSession.findUnique({ where: { id: parseInt(sessionId) } });
    if (!session || !session.isActive) {
      return { success: false, error: "Attendance session is no longer active." };
    }

    const attendance = await prisma.attendance.upsert({
      where: {
        sessionId_userId: {
          sessionId: parseInt(sessionId),
          userId: parseInt(userId)
        }
      },
      update: {
        status,
        proofUrl: proofUrl || null,
        date: new Date()
      },
      create: {
        sessionId: parseInt(sessionId),
        userId: parseInt(userId),
        status,
        proofUrl: proofUrl || null,
        date: new Date()
      }
    });
    
    revalidatePath("/attendance");
    revalidatePath("/dashboard");
    return { success: true, data: attendance };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
