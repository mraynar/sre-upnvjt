import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const leaderboard = await db.select({
      id: user.id,
      name: user.name,
      positionName: user.positionName,
      profilePictureUrl: user.profilePictureUrl,
      totalPoints: user.totalPoints,
    }).from(user)
      .where(eq(user.isActive, true))
      .orderBy(desc(user.totalPoints));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
