import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import SettingsClient from "./SettingsClient";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Settings - SRE UPN Jatim",
  description: "User and System Settings",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
    include: {
      role: true,
      department: true,
    }
  });

  if (!user) {
    redirect("/login");
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    npm: user.npm || "",
    roleName: user.role.name,
    departmentName: user.department?.name || "-",
  };

  return <SettingsClient user={safeUser} />;
}
