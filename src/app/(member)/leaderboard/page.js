import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { user, memberProfile, division } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import LeaderboardMemberClient from "./LeaderboardMemberClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Leaderboard Poin & Ranking | SRE Portal",
  description: "Lihat daftar peringkat keaktifan pengurus dan kumpulkan poin keaktifan XP.",
};

export default async function MemberLeaderboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Fetch leaderboard data
  const data = await db
    .select({
      id: user.id,
      name: user.name,
      npm: user.npm,
      profilePictureUrl: user.profilePictureUrl,
      xp: memberProfile.xp,
      level: memberProfile.level,
      divisionName: division.name,
    })
    .from(memberProfile)
    .innerJoin(user, eq(user.id, memberProfile.userId))
    .leftJoin(division, eq(division.id, user.divisionId))
    .orderBy(desc(memberProfile.xp));

  const ranked = data.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));

  return (
    <LeaderboardMemberClient
      initialLeaderboard={ranked}
      currentUserId={parseInt(session.user.id)}
    />
  );
}
