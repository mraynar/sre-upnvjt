import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quiz, quizQuestion, quizSubmission, memberProfile, xpTransaction } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quizId = parseInt(params.id);
    const body = await req.json();
    const { answers } = body; // Array of { questionId, selectedOptionId, essayText }

    // Fetch quiz & questions
    const qz = await db.query.quiz.findFirst({
      where: (t, { eq }) => eq(t.id, quizId),
      with: {
        questions: true,
      },
    });

    if (!qz) {
      return NextResponse.json({ error: "Kuis tidak ditemukan" }, { status: 404 });
    }

    // Auto grading MCQ
    let totalMcqPoints = 0;
    let earnedMcqPoints = 0;
    let hasEssay = false;

    qz.questions.forEach((q) => {
      if (q.type === "MULTIPLE_CHOICE") {
        totalMcqPoints += q.points;
        const ans = answers.find((a) => a.questionId === q.id);
        if (ans && ans.selectedOptionId === q.correctOptionId) {
          earnedMcqPoints += q.points;
        }
      } else {
        hasEssay = true;
      }
    });

    const mcqScore = totalMcqPoints > 0 ? Math.round((earnedMcqPoints / totalMcqPoints) * 100) : 100;
    let totalScore = null;
    let isPassed = null;

    if (!hasEssay) {
      totalScore = mcqScore;
      isPassed = totalScore >= (qz.passingScore ?? 70);
    }

    // Insert submission
    const [submission] = await db.insert(quizSubmission).values({
      quizId,
      memberId: session.user.id,
      answers: answers || [],
      mcqScore,
      essayScore: null,
      totalScore,
      isPassed,
    }).returning();

    // Reward XP if passed
    if (isPassed && qz.rewardXp > 0) {
      // Upsert memberProfile
      const profile = await db.query.memberProfile.findFirst({
        where: eq(memberProfile.userId, session.user.id),
      });

      const gainedXp = qz.rewardXp;
      if (!profile) {
        // level seedling (1)
        await db.insert(memberProfile).values({
          userId: session.user.id,
          xp: gainedXp,
          level: 1,
        });
      } else {
        const nextXp = profile.xp + gainedXp;
        // Simple level threshold (e.g., level = floor(xp / 100) + 1)
        const nextLevel = Math.floor(nextXp / 100) + 1;
        await db.update(memberProfile)
          .set({ xp: nextXp, level: nextLevel })
          .where(eq(memberProfile.userId, session.user.id));
      }

      // Log XP transaction
      await db.insert(xpTransaction).values({
        userId: session.user.id,
        amount: gainedXp,
        reason: `Menyelesaikan Kuis: ${qz.title}`,
        sourceType: "quiz",
        sourceId: submission.id,
      });
    }

    return NextResponse.json({
      success: true,
      submission,
      hasEssay,
      earnedMcqPoints,
      totalMcqPoints,
      isPassed,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
