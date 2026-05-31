"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        department: true,
        committees: {
          include: {
            user: true
          }
        },
        _count: {
          select: { committees: true, finances: true, attendances: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return { success: true, data: projects };
  } catch (error) {
    return { success: false, error: "Failed to fetch projects: " + error.message };
  }
}

export async function createProject(data) {
  try {
    const { title, description, departmentId, startDate, endDate, status } = data;
    const project = await prisma.project.create({
      data: {
        title,
        description,
        departmentId: parseInt(departmentId),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status: status || "PENDING"
      }
    });
    revalidatePath("/projects");
    return { success: true, data: project };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateProject(id, data) {
  try {
    const { title, description, departmentId, startDate, endDate, status } = data;
    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        departmentId: parseInt(departmentId),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status
      }
    });
    revalidatePath("/projects");
    return { success: true, data: project };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteProject(id) {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}


export async function addCommitteeMember(data) {
  try {
    const { projectId, userId, role } = data;
    
    const existing = await prisma.committee.findUnique({
      where: {
        userId_projectId: {
          userId: parseInt(userId),
          projectId: parseInt(projectId)
        }
      }
    });

    if (existing) {
      return { success: false, error: "User is already in this committee." };
    }

    const member = await prisma.committee.create({
      data: {
        projectId: parseInt(projectId),
        userId: parseInt(userId),
        role
      }
    });
    revalidatePath("/projects");
    return { success: true, data: member };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function removeCommitteeMember(id) {
  try {
    await prisma.committee.delete({ where: { id } });
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
