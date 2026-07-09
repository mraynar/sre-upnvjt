import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { memberProfile, xpTransaction, pptModule } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const moduleId = parseInt(id, 10);

    if (isNaN(moduleId)) {
      return NextResponse.json({ error: "Invalid module ID" }, { status: 400 });
    }

    // Check if module exists
    const moduleData = await db.query.pptModule.findFirst({
      where: eq(pptModule.id, moduleId),
    });

    if (!moduleData) {
      return NextResponse.json({ error: "Modul tidak ditemukan" }, { status: 404 });
    }

    // Check if user already got XP for this module
    const existingTransaction = await db.query.xpTransaction.findFirst({
      where: and(
        eq(xpTransaction.userId, session.user.id),
        eq(xpTransaction.sourceType, "ppt_module"),
        eq(xpTransaction.sourceId, moduleId)
      ),
    });

    if (existingTransaction) {
      return NextResponse.json(
        { success: false, message: "XP sudah pernah diberikan untuk modul ini." },
        { status: 200 } // Not an error, just return a graceful response
      );
    }

    const gainedXp = 10;

    // Fetch member profile
    const profile = await db.query.memberProfile.findFirst({
      where: eq(memberProfile.userId, session.user.id),
    });

    if (!profile) {
      // First time getting XP
      await db.insert(memberProfile).values({
        userId: session.user.id,
        xp: gainedXp,
        level: 1,
      });
    } else {
      const nextXp = profile.xp + gainedXp;
      const nextLevel = Math.floor(nextXp / 100) + 1;
      await db.update(memberProfile)
        .set({ xp: nextXp, level: nextLevel })
        .where(eq(memberProfile.userId, session.user.id));
    }

    // Log XP transaction
    await db.insert(xpTransaction).values({
      userId: session.user.id,
      amount: gainedXp,
      reason: `Membaca modul materi: ${moduleData.title}`,
      sourceType: "ppt_module",
      sourceId: moduleId,
    });

    return NextResponse.json({
      success: true,
      message: `Berhasil mendapatkan ${gainedXp} XP!`,
      gainedXp,
    });
  } catch (error) {
    console.error("Error in materi completion API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
