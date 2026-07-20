import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quizSubmission, quiz, memberProfile, xpTransaction } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.roleName !== "SUPER_ADMIN" && session.user.roleName !== "STAFF_HR") {
      return NextResponse.json({ error: "Forbidden: Admin access only" }, { status: 403 });
    }

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const body = await req.json();
    const { essayScore } = body;

    if (essayScore === undefined || essayScore === null) {
      return NextResponse.json({ error: "Nilai essay wajib diisi" }, { status: 400 });
    }

    const score = parseInt(essayScore);

    // Fetch submission with quiz
    const submission = await db.query.quizSubmission.findFirst({
      where: eq(quizSubmission.id, id),
      with: {
        quiz: true,
      },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submisi tidak ditemukan" }, { status: 404 });
    }

    const mcqVal = submission.mcqScore || 0;
    const totalScore = mcqVal + score;
    const isPassed = totalScore >= (submission.quiz.passingScore ?? 70);

    const wasPassed = submission.isPassed;

    const [updated] = await db.update(quizSubmission)
      .set({
        essayScore: score,
        totalScore,
        isPassed,
        gradedById: session.user.id,
        gradedAt: new Date(),
      })
      .where(eq(quizSubmission.id, id))
      .returning();

    // Reward XP if status transitioned to passed
    if (isPassed && !wasPassed && submission.quiz.rewardXp > 0) {
      const profile = await db.query.memberProfile.findFirst({
        where: eq(memberProfile.userId, submission.memberId),
      });

      const gainedXp = submission.quiz.rewardXp;
      if (!profile) {
        await db.insert(memberProfile).values({
          userId: submission.memberId,
          xp: gainedXp,
          level: 1,
        });
      } else {
        const nextXp = profile.xp + gainedXp;
        const nextLevel = Math.floor(nextXp / 100) + 1;
        await db.update(memberProfile)
          .set({ xp: nextXp, level: nextLevel })
          .where(eq(memberProfile.userId, submission.memberId));
      }

      await db.insert(xpTransaction).values({
        userId: submission.memberId,
        amount: gainedXp,
        reason: `Evaluasi Kuis: ${submission.quiz.title}`,
        sourceType: "quiz",
        sourceId: submission.id,
      });
    }

    return NextResponse.json({ success: true, submission: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
