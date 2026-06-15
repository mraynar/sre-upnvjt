import React from "react";
import { db } from "@/lib/db";
import { user, attendanceSession, project } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import AttendanceClient from "./AttendanceClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Sistem Presensi | SRE Portal",
};

export default async function AttendancePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const currentUser = await db.query.user.findFirst({
    where: eq(user.email, session.user.email),
    with: { role: true }
  });

  if (!currentUser) redirect("/login");

  const attendanceSessions = await db.query.attendanceSession.findMany({
    with: {
      createdBy: { columns: { name: true } },
      project: { columns: { title: true } },
      attendances: {
        with: { user: { columns: { name: true, npm: true } } }
      }
    },
    orderBy: [desc(attendanceSession.date)]
  });

  const users = await db.query.user.findMany({
    columns: { id: true, name: true, npm: true, isActive: true },
    where: eq(user.isActive, true),
    orderBy: [asc(user.name)]
  });

  const projects = await db.query.project.findMany({
    orderBy: [asc(project.title)]
  });

  const canManageAttendance = currentUser.role.name === 'SUPER_ADMIN' || currentUser.role.name.includes('Manager');

  const serialized = JSON.parse(JSON.stringify({
    attendanceSessions,
    users,
    projects,
    currentUser
  }));

  return (
    <AttendanceClient 
      attendanceSessions={serialized.attendanceSessions} 
      users={serialized.users}
      projects={serialized.projects}
      currentUser={serialized.currentUser}
      canManage={canManageAttendance}
    />
  );
}
