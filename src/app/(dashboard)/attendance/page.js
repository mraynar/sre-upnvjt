import React from "react";
import prisma from "@/lib/prisma";
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

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { role: true }
  });

  if (!currentUser) redirect("/login");

  const attendanceSessions = await prisma.attendanceSession.findMany({
    include: {
      createdBy: { select: { name: true } },
      project: { select: { title: true } },
      attendances: {
        include: { user: { select: { name: true, npm: true } } }
      }
    },
    orderBy: { date: "desc" }
  });

  const users = await prisma.user.findMany({
    select: { id: true, name: true, npm: true, isActive: true },
    where: { isActive: true },
    orderBy: { name: "asc" }
  });

  const projects = await prisma.project.findMany({
    orderBy: { title: "asc" }
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
