import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quiz, quizQuestion, quizSubmission, memberProfile, xpTransaction } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const quizId = parseInt(resolvedParams.id);
    const body = await req.json();
    const { answers } = body; // Array of { questionId, selectedOptionId, essayText }

    if (!Array.isArray(answers)) {
      return NextResponse.json({ error: "Format jawaban tidak valid" }, { status: 400 });
    }

    // Check if already submitted
    const existingSubmission = await db.query.quizSubmission.findFirst({
      where: and(
        eq(quizSubmission.quizId, quizId),
        eq(quizSubmission.memberId, parseInt(session.user.id))
      )
    });

    if (existingSubmission) {
      return NextResponse.json({ error: "Kuis ini hanya dapat dikerjakan satu kali." }, { status: 403 });
    }

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
    
    let totalEssayPoints = 0;
    let earnedEssayPoints = 0;

    let hasEssay = false;

    let cleanedAnswers = [];

    qz.questions.forEach((q) => {
      const type = q.type.toLowerCase();
      const ans = answers.find((a) => a.questionId === q.id);
      if (!ans) return;

      let finalAnswer = null;

      if (type === "multiple_choice" || type === "true_false") {
        totalMcqPoints += q.points;
        finalAnswer = ans.selectedOptionId;
        if (ans.selectedOptionId === q.correctOptionId) {
          earnedMcqPoints += q.points;
        }
      } else if (type === "multiple_choice_complex") {
        totalMcqPoints += q.points;
        const correctArr = (q.correctOptionId || "").split(",").map(s => s.trim()).filter(Boolean);
        const selectedArr = ans.selectedOptionIds || [];
        finalAnswer = selectedArr;
        
        if (correctArr.length > 0) {
          const pointsPerCorrect = q.points / correctArr.length;
          let earned = 0;
          selectedArr.forEach(id => {
            if (correctArr.includes(id)) {
              earned += pointsPerCorrect;
            } else {
              earned -= pointsPerCorrect; // Penalize wrong options
            }
          });
          const earnedFinal = Math.max(0, Math.round(earned));
          earnedMcqPoints += earnedFinal;
        }
      } else if (type === "short_answer" || type === "essay") {
        finalAnswer = ans.essayText;
        if (q.correctOptionId && q.correctOptionId.trim() !== "") {
          totalEssayPoints += q.points;
          const userAns = (finalAnswer || "").trim().toLowerCase();
          const correctKey = q.correctOptionId.trim().toLowerCase();
          
          if (userAns === correctKey) {
            earnedEssayPoints += q.points;
          }
        } else {
          hasEssay = true; // Needs manual grading
        }
      }

      cleanedAnswers.push({
        questionId: q.id,
        answer: finalAnswer
      });
    });

    const mcqScore = earnedMcqPoints;
    const essayScore = hasEssay && totalEssayPoints === 0 ? null : earnedEssayPoints;
    
    let totalScore = null;
    let isPassed = null;

    if (!hasEssay || (hasEssay && totalEssayPoints > 0)) {
      const totalPoints = totalMcqPoints + totalEssayPoints;
      totalScore = earnedMcqPoints + earnedEssayPoints;
      const percentage = totalPoints > 0 ? Math.round((totalScore / totalPoints) * 100) : 100;
      isPassed = percentage >= (qz.passingScore ?? 70);
    }

    // Insert submission
    const [submission] = await db.insert(quizSubmission).values({
      quizId,
      memberId: parseInt(session.user.id),
      answers: cleanedAnswers,
      mcqScore,
      essayScore,
      totalScore,
      isPassed,
      submittedAt: new Date(),
    }).returning();

    let gainedXp = 0;
    if (isPassed === true) {
      gainedXp = qz.rewardXp || 0;
    } else if (isPassed === false && totalScore > 0) {
      // Calculate percentage for XP reward
      const totalPoints = totalMcqPoints + (hasEssay && totalEssayPoints === 0 ? 0 : totalEssayPoints);
      const percentage = totalPoints > 0 ? (totalScore / totalPoints) : 0;
      gainedXp = Math.floor(percentage * (qz.rewardXp || 0));
    }

    if (gainedXp > 0) {
      const parsedUserId = parseInt(session.user.id);
      // Upsert memberProfile
      const profile = await db.query.memberProfile.findFirst({
        where: eq(memberProfile.userId, parsedUserId),
      });

      if (!profile) {
        // level seedling (1)
        await db.insert(memberProfile).values({
          userId: parsedUserId,
          xp: gainedXp,
          level: 1,
        });
      } else {
        const nextXp = profile.xp + gainedXp;
        // Simple level threshold (e.g., level = floor(xp / 100) + 1)
        const nextLevel = Math.floor(nextXp / 100) + 1;
        await db.update(memberProfile)
          .set({ xp: nextXp, level: nextLevel })
          .where(eq(memberProfile.userId, parsedUserId));
      }

      // Log XP transaction
      await db.insert(xpTransaction).values({
        userId: parsedUserId,
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
      gainedXp,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
