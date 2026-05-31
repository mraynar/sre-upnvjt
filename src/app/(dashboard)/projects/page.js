import React from "react";
import prisma from "@/lib/prisma";
import ProjectsClient from "./ProjectsClient";

export const metadata = {
  title: "Program Kerja | SRE Portal",
};

export default async function ProjectsPage() {
  let projects = [];
  let departments = [];
  let users = [];

  try {
    projects = await prisma.project.findMany({
      include: {
        department: true,
        committees: {
          include: {
            user: {
              include: { role: true }
            }
          },
          orderBy: { id: "asc" }
        },
        _count: {
          select: { committees: true, attendanceSessions: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  } catch (e) {
    console.error("Error fetching projects:", e);
  }

  try {
    departments = await prisma.department.findMany({
      orderBy: { name: "asc" }
    });
  } catch (e) {
    console.error("Error fetching departments:", e);
  }

  try {
    users = await prisma.user.findMany({
      where: { isActive: true },
      include: { role: true, department: true },
      orderBy: { name: "asc" }
    });
  } catch (e) {
    console.error("Error fetching users:", e);
  }

  const serialized = JSON.parse(JSON.stringify({ projects, departments, users }));

  return (
    <ProjectsClient 
      initialProjects={serialized.projects} 
      departments={serialized.departments}
      users={serialized.users}
    />
  );
}
