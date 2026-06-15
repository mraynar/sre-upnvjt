import React from "react";
import { db } from "@/lib/db";
import { user, role, department, division } from "@/db/schema";
import { desc, asc } from "drizzle-orm";
import UsersClient from "./UsersClient";

export const metadata = {
  title: "User Management | SRE Portal",
};

export default async function UsersPage() {
  const users = await db.query.user.findMany({
    with: {
      role: true,
      department: true,
      division: true
    },
    orderBy: [desc(user.createdAt)]
  });

  const roles = await db.query.role.findMany({
    orderBy: [asc(role.id)]
  });

  const departments = await db.query.department.findMany({
    orderBy: [asc(department.name)]
  });

  const divisions = await db.query.division.findMany({
    orderBy: [asc(division.name)]
  });

  return (
    <UsersClient 
      initialUsers={users} 
      roles={roles}
      departments={departments}
      divisions={divisions}
    />
  );
}
