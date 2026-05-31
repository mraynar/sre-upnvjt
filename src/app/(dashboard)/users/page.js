import React from "react";
import prisma from "@/lib/prisma";
import UsersClient from "./UsersClient";

export const metadata = {
  title: "User Management | SRE Portal",
};

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
      role: true,
      department: true,
      division: true
    },
    orderBy: { createdAt: "desc" }
  });

  const roles = await prisma.role.findMany({
    orderBy: { id: "asc" }
  });

  const departments = await prisma.department.findMany({
    orderBy: { name: "asc" }
  });

  const divisions = await prisma.division.findMany({
    orderBy: { name: "asc" }
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
