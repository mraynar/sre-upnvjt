import React from "react";
import DashboardClient from "./DashboardClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getDashboardStats } from "@/app/actions/dashboardActions";

export const metadata = {
  title: "Dashboard Overview | SRE Portal",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { role: true, department: true }
  });

  if (!currentUser) redirect("/login");

  const roleName = currentUser.role?.name || "";
  const departmentId = currentUser.departmentId;

  const statsResponse = await getDashboardStats(currentUser.role.name, currentUser.departmentId, currentUser.id);
  const stats = statsResponse.success ? statsResponse.data : null;

  return <DashboardClient stats={stats} />;
}
