import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { achievement, user, userPointHistory } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, description, proofUrl } = body;

    await db.insert(achievement).values({
      userId: session.user.id,
      title,
      description,
      proofUrl,
      status: 'PENDING',
      pointsAwarded: 0,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const list = await db.select().from(achievement).where(eq(achievement.userId, session.user.id)).orderBy(desc(achievement.createdAt));
    return NextResponse.json(list);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
