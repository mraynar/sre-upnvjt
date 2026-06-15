"use server";

import { db } from "@/lib/db";
import { project, committee } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  try {
    const projects = await db.query.project.findMany({
      with: {
        department: true,
        committees: {
          with: {
            user: true
          }
        },
        finances: { columns: { id: true } },
        attendanceSessions: { columns: { id: true } }
      },
      orderBy: [desc(project.createdAt)]
    });
    
    const formattedProjects = projects.map(p => {
      const { finances, attendanceSessions, ...rest } = p;
      return { 
        ...rest, 
        _count: { 
          committees: p.committees.length, 
          finances: finances.length, 
          attendances: attendanceSessions.length 
        } 
      };
    });
    return { success: true, data: formattedProjects };
  } catch (error) {
    return { success: false, error: "Failed to fetch projects: " + error.message };
  }
}

export async function createProject(data) {
  try {
    const { title, description, departmentId, startDate, endDate, status } = data;
    const [result] = await db.insert(project).values({
      title,
      description,
      departmentId: parseInt(departmentId),
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      status: status || "PENDING"
    });
    revalidatePath("/projects");
    return { success: true, data: { id: result.insertId, title } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateProject(id, data) {
  try {
    const { title, description, departmentId, startDate, endDate, status } = data;
    await db.update(project).set({
      title,
      description,
      departmentId: parseInt(departmentId),
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      status
    }).where(eq(project.id, id));
    revalidatePath("/projects");
    return { success: true, data: { id, title } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteProject(id) {
  try {
    await db.delete(project).where(eq(project.id, id));
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function addCommitteeMember(data) {
  try {
    const { projectId, userId, role } = data;
    
    const existing = await db.query.committee.findFirst({
      where: and(eq(committee.userId, parseInt(userId)), eq(committee.projectId, parseInt(projectId)))
    });

    if (existing) {
      return { success: false, error: "User is already in this committee." };
    }

    const [result] = await db.insert(committee).values({
      projectId: parseInt(projectId),
      userId: parseInt(userId),
      role
    });
    revalidatePath("/projects");
    return { success: true, data: { id: result.insertId, role } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function removeCommitteeMember(id) {
  try {
    await db.delete(committee).where(eq(committee.id, id));
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
