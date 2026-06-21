import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ShortlinkClient from "./ShortlinkClient";
import { getShortlinks } from "@/app/actions/shortlinkActions";
import { db } from "@/lib/db";
import { user as userSchema } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shortlinks | SRE Portal",
};

export default async function ShortlinkPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const currentUser = await db.query.user.findFirst({
    where: eq(userSchema.email, session.user.email),
    with: { role: true }
  });

  if (!currentUser) {
    redirect("/login");
  }

  // Construct a safe user object to pass to the client
  const userForPerms = {
    ...session.user,
    roleName: currentUser.role?.name || "USER",
    permissions: currentUser.role?.permissions || {}
  };

  const { success, data, error } = await getShortlinks();

  if (!success && error === "Unauthorized") {
    redirect("/dashboard");
  }

  return <ShortlinkClient initialData={data || []} user={userForPerms} />;
}
