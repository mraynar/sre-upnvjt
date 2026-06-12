import React from "react";
import db from "@/lib/prisma";
import { department } from "@/db/schema";
import { asc } from "drizzle-orm";
import DepartmentsClient from "./DepartmentsClient";

export const metadata = {
  title: "Departments & Divisions | SRE Portal",
};

export default async function DepartmentsPage() {
  const fetchedDepartments = await db.query.department.findMany({
    with: {
      divisions: true,
      users: { columns: { id: true } }
    },
    orderBy: [asc(department.name)]
  });

  const departments = fetchedDepartments.map(d => {
    const { users, ...rest } = d;
    return {
      ...rest,
      _count: { users: users.length }
    };
  });

  return <DepartmentsClient initialDepartments={departments} />;
}
