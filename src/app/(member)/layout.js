import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { memberProfile, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import MemberNavbarClient from "./MemberNavbarClient";

export const dynamic = "force-dynamic";

export default async function MemberLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Load the member's profile for XP & Level
  let profile = await db.query.memberProfile.findFirst({
    where: eq(memberProfile.userId, parseInt(session.user.id)),
  });

  if (!profile) {
    // If somehow profile is missing, initialize it
    const [newProfile] = await db.insert(memberProfile).values({
      userId: parseInt(session.user.id),
      xp: 0,
      level: 1,
    }).returning();
    profile = newProfile;
  }

  return (
    <div className="min-h-screen bg-[#07130e] text-white flex flex-col">
      <MemberNavbarClient
        user={session.user}
        profile={profile}
      />
      <main className="flex-1 pt-28 px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
