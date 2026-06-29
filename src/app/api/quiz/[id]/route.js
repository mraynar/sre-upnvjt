import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quiz, quizQuestion, quizSubmission } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);
    const result = await db.query.quiz.findFirst({
      where: (t, { eq }) => eq(t.id, id),
      with: {
        questions: { orderBy: [asc(quizQuestion.order)] },
      },
    });

    if (!result) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    const body = await req.json();
    const { title, description, timeLimitMinutes, passingScore, rewardXp, isPublished } = body;

    if (!title) {
      return NextResponse.json({ error: "Judul kuis wajib diisi" }, { status: 400 });
    }

    const [updated] = await db.update(quiz)
      .set({
        title,
        description: description || null,
        timeLimitMinutes: timeLimitMinutes ? parseInt(timeLimitMinutes) : null,
        passingScore: passingScore ? parseInt(passingScore) : 70,
        rewardXp: rewardXp ? parseInt(rewardXp) : 0,
        isPublished: Boolean(isPublished),
      })
      .where(eq(quiz.id, id))
      .returning();

    return NextResponse.json({ success: true, quiz: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    // Delete dependent submissions, then questions, then the quiz
    await db.delete(quizSubmission).where(eq(quizSubmission.quizId, id));
    await db.delete(quizQuestion).where(eq(quizQuestion.quizId, id));
    await db.delete(quiz).where(eq(quiz.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
