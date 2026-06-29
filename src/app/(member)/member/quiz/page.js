import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { quiz, quizSubmission } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import QuizMemberClient from "./QuizMemberClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quiz & Asesmen Pembelajaran | SRE Portal",
  description: "Kerjakan kuis berkala untuk menguji kemampuan Anda dan dapatkan bonus XP.",
};

export default async function MemberQuizPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Fetch only published quizzes
  const quizzes = await db.query.quiz.findMany({
    where: eq(quiz.isPublished, true),
    orderBy: [desc(quiz.createdAt)],
  });

  // Fetch member's own submissions
  const submissions = await db.query.quizSubmission.findMany({
    where: eq(quizSubmission.memberId, parseInt(session.user.id)),
    orderBy: [desc(quizSubmission.submittedAt)],
  });

  return (
    <QuizMemberClient
      initialQuizzes={quizzes}
      initialSubmissions={submissions}
    />
  );
}
