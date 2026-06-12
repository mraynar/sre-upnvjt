import React from "react";
import db from "@/lib/prisma";
import { project, department, user } from "@/db/schema";
import { desc, asc, eq } from "drizzle-orm";
import ProjectsClient from "./ProjectsClient";

export const metadata = {
  title: "Program Kerja | SRE Portal",
};

export default async function ProjectsPage() {
  let projects = [];
  let departments = [];
  let users = [];

  try {
    const fetchedProjects = await db.query.project.findMany({
      with: {
        department: true,
        committees: {
          with: {
            user: {
              with: { role: true }
            }
          },
          orderBy: (committees, { asc }) => [asc(committees.id)]
        },
        attendanceSessions: { columns: { id: true } }
      },
      orderBy: [desc(project.createdAt)]
    });
    
    projects = fetchedProjects.map(p => {
      const { attendanceSessions, ...rest } = p;
      return {
        ...rest,
        _count: {
          committees: rest.committees.length,
          attendanceSessions: attendanceSessions.length
        }
      };
    });
  } catch (e) {
    console.error("Error fetching projects:", e);
  }

  try {
    departments = await db.query.department.findMany({
      orderBy: [asc(department.name)]
    });
  } catch (e) {
    console.error("Error fetching departments:", e);
  }

  try {
    users = await db.query.user.findMany({
      where: eq(user.isActive, true),
      with: { role: true, department: true },
      orderBy: [asc(user.name)]
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
