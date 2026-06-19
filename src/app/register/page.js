import { db } from "@/lib/db";
import { systemSetting, role, department, division } from "@/db/schema";
import { eq, not } from "drizzle-orm";
import { redirect } from "next/navigation";
import RegisterClient from "./RegisterClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Create Account | SRE UPNVJT",
  description: "Register a new account on the Society of Renewable Energy UPNVJT portal.",
};

export default async function RegisterPage() {
  // Check if registration is enabled
  const setting = await db.query.systemSetting.findFirst({
    where: eq(systemSetting.keyName, "ENABLE_PUBLIC_REGISTRATION")
  });

  if (!setting || setting.valueData !== "true") {
    redirect("/login");
  }

  // Fetch roles (excluding SUPER_ADMIN for security)
  const roles = await db.query.role.findMany({
    where: not(eq(role.name, "SUPER_ADMIN"))
  });

  // Fetch departments and divisions
  const departments = await db.query.department.findMany();
  const divisions = await db.query.division.findMany();

  return (
    <RegisterClient 
      roles={roles} 
      departments={departments} 
      divisions={divisions} 
    />
  );
}
