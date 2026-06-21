import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import SettingsClient from "./SettingsClient";
import { db } from "@/lib/db";
import { user as userSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Settings - SRE UPN Jatim",
  description: "User and System Settings",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const currentUser = await db.query.user.findFirst({
    where: eq(userSchema.email, session.user.email),
    with: {
      role: true,
      department: true,
    }
  });

  if (!currentUser) {
    redirect("/login");
  }

  const safeUser = {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    npm: currentUser.npm || "",
    roleName: currentUser.role?.name || "USER",
    departmentName: currentUser.department?.name || "-",
  };

  return <SettingsClient user={safeUser} />;
}
