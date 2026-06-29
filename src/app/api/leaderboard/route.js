import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user, memberProfile, division } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
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

    return NextResponse.json(ranked);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
