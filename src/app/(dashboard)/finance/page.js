import React from "react";
import db from "@/lib/prisma";
import { user, finance, project } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import FinanceClient from "./FinanceClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Buku Kas | SRE Portal",
};

export default async function FinancePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const currentUser = await db.query.user.findFirst({
    where: eq(user.email, session.user.email),
    with: { role: true }
  });

  if (!currentUser) redirect("/login");

  const records = await db.query.finance.findMany({
    with: {
      project: true,
      loggedBy: true
    },
    orderBy: [desc(finance.date)]
  });

  const projects = await db.query.project.findMany({
    orderBy: [asc(project.title)]
  });

  return (
    <FinanceClient 
      initialRecords={records} 
      projects={projects}
      currentUser={currentUser}
    />
  );
}
