import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { achievement, user, userPointHistory } from '@/db/schema';
import { eq, and, ne, desc } from 'drizzle-orm';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const roleName = session.user.roleName;
    if (!['SUPER_ADMIN', 'PRESIDENT', 'DIRECTOR'].includes(roleName)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Ambil daftar klaim yang statusnya PENDING dan BUKAN milik user yang sedang login
    const pendingList = await db.select({
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      proofUrl: achievement.proofUrl,
      status: achievement.status,
      createdAt: achievement.createdAt,
      userId: achievement.userId,
      userName: user.name,
      userNpm: user.npm,
    })
    .from(achievement)
    .innerJoin(user, eq(achievement.userId, user.id))
    .where(
      and(
        eq(achievement.status, 'PENDING'),
        ne(achievement.userId, session.user.id)
      )
    )
    .orderBy(desc(achievement.createdAt));

    return NextResponse.json(pendingList);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const roleName = session.user.roleName;
    if (!['SUPER_ADMIN', 'PRESIDENT', 'DIRECTOR'].includes(roleName)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { achievementId, action, points } = body; // action = 'APPROVE' or 'REJECT'

    if (!achievementId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ambil detail klaim
    const klaim = await db.select().from(achievement).where(eq(achievement.id, achievementId)).limit(1);
    if (klaim.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const targetKlaim = klaim[0];

    // Cek jangan sampai verifikasi milik sendiri
    if (targetKlaim.userId === parseInt(session.user.id)) {
      return NextResponse.json({ error: "Anda tidak bisa memverifikasi klaim Anda sendiri." }, { status: 403 });
    }

    if (action === 'REJECT') {
      await db.update(achievement).set({ status: 'REJECTED' }).where(eq(achievement.id, achievementId));
      return NextResponse.json({ success: true, message: "Klaim berhasil ditolak." });
    }

    if (action === 'APPROVE') {
      const awardedPoints = parseInt(points) || 0;
      
      // 1. Update status klaim
      await db.update(achievement).set({ 
        status: 'APPROVED',
        pointsAwarded: awardedPoints,
      }).where(eq(achievement.id, achievementId));

      // 2. Update poin user
      const targetUser = await db.select().from(user).where(eq(user.id, targetKlaim.userId)).limit(1);
      if (targetUser.length > 0) {
        const currentPoints = targetUser[0].totalPoints || 0;
        await db.update(user).set({ totalPoints: currentPoints + awardedPoints }).where(eq(user.id, targetKlaim.userId));
        
        // 3. Log ke Point History
        await db.insert(userPointHistory).values({
          userId: targetKlaim.userId,
          source: 'ACHIEVEMENT',
          points: awardedPoints,
          description: `Prestasi disetujui oleh ${session.user.name}: ${targetKlaim.title}`,
        });
      }

      return NextResponse.json({ success: true, message: "Klaim disetujui dan poin telah ditambahkan." });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to process verification" }, { status: 500 });
  }
}
