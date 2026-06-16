import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user, appraisal, userPointHistory, role } from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { evaluateeId, score, feedback, period } = body;

    if (!evaluateeId || score === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const numericScore = parseInt(score);

    // Save appraisal
    await db.insert(appraisal).values({
      evaluatorId: session.user.id,
      evaluateeId: parseInt(evaluateeId),
      score: numericScore,
      feedback: feedback || '',
      period: period || 'Current',
    });

    // Add to totalPoints
    const evaluateeList = await db.select().from(user).where(eq(user.id, evaluateeId)).limit(1);
    if (evaluateeList.length > 0) {
      const currentPoints = evaluateeList[0].totalPoints || 0;
      await db.update(user).set({ totalPoints: currentPoints + numericScore }).where(eq(user.id, evaluateeId));
      
      // Log history
      await db.insert(userPointHistory).values({
        userId: evaluateeId,
        source: 'APPRAISAL',
        points: numericScore,
        description: `Appraisal from ${session.user.name} for period: ${period}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to submit appraisal" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roleName = session.user.roleName;
    let targetRoles = [];

    if (roleName === 'SUPER_ADMIN') {
      targetRoles = ['PRESIDENT', 'DIRECTOR', 'MANAGER', 'STAFF'];
    } else if (roleName === 'PRESIDENT') {
      targetRoles = ['DIRECTOR'];
    } else if (roleName === 'DIRECTOR') {
      targetRoles = ['MANAGER'];
    } else if (roleName === 'MANAGER') {
      targetRoles = ['STAFF'];
    }

    if (targetRoles.length === 0) {
      return NextResponse.json([]); // Staff or unassigned cannot evaluate anyone
    }

    const users = await db.select({
      id: user.id,
      name: user.name,
      positionName: user.positionName,
    })
    .from(user)
    .innerJoin(role, eq(user.roleId, role.id))
    .where(
      and(
        eq(user.isActive, true),
        inArray(role.name, targetRoles)
      )
    );

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
