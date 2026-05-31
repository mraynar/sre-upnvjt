import React from "react";
import prisma from "@/lib/prisma";
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

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { role: true }
  });

  if (!currentUser) redirect("/login");

  const records = await prisma.finance.findMany({
    include: {
      project: true,
      loggedBy: true
    },
    orderBy: { date: "desc" }
  });

  const projects = await prisma.project.findMany({
    orderBy: { title: "asc" }
  });

  return (
    <FinanceClient 
      initialRecords={records} 
      projects={projects}
      currentUser={currentUser}
    />
  );
}
