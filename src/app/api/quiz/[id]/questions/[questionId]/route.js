import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quizQuestion } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const questionId = parseInt(resolvedParams.questionId);
    const body = await req.json();
    const { type, question, options, correctOptionId, points, order } = body;

    if (!type || !question) {
      return NextResponse.json({ error: "Tipe dan pertanyaan wajib diisi" }, { status: 400 });
    }

    const [updated] = await db.update(quizQuestion)
      .set({
        type,
        question,
        options: options || [],
        correctOptionId: correctOptionId || null,
        points: points ? parseInt(points) : 1,
        ...(order !== undefined ? { order: parseInt(order) } : {}),
      })
      .where(eq(quizQuestion.id, questionId))
      .returning();

    return NextResponse.json({ success: true, question: updated });
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

    const resolvedParams = await params;
    const questionId = parseInt(resolvedParams.questionId);
    const quizId = parseInt(resolvedParams.id);

    await db.delete(quizQuestion).where(eq(quizQuestion.id, questionId));

    // Reorder remaining questions to avoid gaps
    const remaining = await db.query.quizQuestion.findMany({
      where: (t, { eq }) => eq(t.quizId, quizId),
      orderBy: [asc(quizQuestion.order)],
    });

    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].order !== i + 1) {
        await db.update(quizQuestion)
          .set({ order: i + 1 })
          .where(eq(quizQuestion.id, remaining[i].id));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
