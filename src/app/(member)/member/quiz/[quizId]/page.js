import { db } from "@/lib/db";
import { quiz, quizSubmission } from "@/db/schema";
import { eq } from "drizzle-orm";
import TakingQuizClient from "./TakingQuizClient";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { and } from "drizzle-orm";

export const metadata = {
  title: "Quiz Mission | SRE Academy",
  description: "Take the quiz",
};

export default async function TakingQuizPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }
  const resolvedParams = await params;
  const quizId = parseInt(resolvedParams.quizId);
  if (isNaN(quizId)) notFound();

  const quizData = await db.query.quiz.findFirst({
    where: eq(quiz.id, quizId),
    with: {
      questions: {
        orderBy: (questions, { asc }) => [asc(questions.order)],
      }
    }
  });

  if (!quizData) notFound();

  const existingSubmission = await db.query.quizSubmission.findFirst({
    where: and(
      eq(quizSubmission.quizId, quizId),
      eq(quizSubmission.memberId, parseInt(session.user.id))
    )
  });

  if (existingSubmission) {
    redirect("/member/quiz");
  }

  return <TakingQuizClient quiz={quizData} user={session.user} />;
}
