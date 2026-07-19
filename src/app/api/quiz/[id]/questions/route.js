import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quizQuestion } from "@/db/schema";
import { eq, asc, max } from "drizzle-orm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const quizId = parseInt(resolvedParams.id);
    const questions = await db.query.quizQuestion.findMany({
      where: (t, { eq }) => eq(t.quizId, quizId),
      orderBy: [asc(quizQuestion.order)],
    });
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const quizId = parseInt(resolvedParams.id);
    const body = await req.json();
    const { type, question, options, correctOptionId, points, order } = body;

    if (!type || !question) {
      return NextResponse.json({ error: "Tipe dan pertanyaan wajib diisi" }, { status: 400 });
    }

    let nextOrder = order;
    if (nextOrder === undefined || nextOrder === null) {
      const [{ maxOrder }] = await db
        .select({ maxOrder: max(quizQuestion.order) })
        .from(quizQuestion)
        .where(eq(quizQuestion.quizId, quizId));
      nextOrder = (maxOrder ?? 0) + 1;
    }

    const [result] = await db.insert(quizQuestion).values({
      quizId,
      order: nextOrder,
      type,
      question,
      options: options || [],
      correctOptionId: correctOptionId || null,
      points: points ? parseInt(points) : 1,
    }).returning();

    return NextResponse.json({ success: true, question: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
