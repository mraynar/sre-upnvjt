import React from "react";
import prisma from "@/lib/prisma";
import DepartmentsClient from "./DepartmentsClient";

export const metadata = {
  title: "Departments & Divisions | SRE Portal",
};

export default async function DepartmentsPage() {
  const departments = await prisma.department.findMany({
    include: {
      divisions: true,
      _count: {
        select: { users: true }
      }
    },
    orderBy: { name: "asc" }
  });

  return <DepartmentsClient initialDepartments={departments} />;
}
