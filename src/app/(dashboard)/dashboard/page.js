import React from "react";
import DashboardClient from "./DashboardClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import db from "@/lib/prisma";
import { getDashboardStats } from "@/app/actions/dashboardActions";

import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export const metadata = {
  title: "Dashboard Overview | SRE Portal",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const currentUser = await db.query.user.findFirst({
    where: eq(user.email, session.user.email),
    with: { role: true, department: true }
  });

  if (!currentUser) redirect("/login");

  const roleName = currentUser.role?.name || "";
  const departmentId = currentUser.departmentId;

  const statsResponse = await getDashboardStats(currentUser.role.name, currentUser.departmentId, currentUser.id);
  const stats = statsResponse.success ? statsResponse.data : null;

  return <DashboardClient stats={stats} user={currentUser} />;
}
