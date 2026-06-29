import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { hasAccess } from "@/lib/permissions";
import { getQuizzes, getQuizSubmissions } from "@/app/actions/quizActions";
import QuizClient from "./QuizClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quiz Management | SRE Portal",
  description: "Kelola kuis dan hasil evaluasi anggota SRE UPNVJT.",
};

export default async function QuizAdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");
  if (!hasAccess(session.user, "quiz", "read")) {
    redirect("/dashboard");
  }

  const [quizzesRes, submissionsRes] = await Promise.all([
    getQuizzes(),
    getQuizSubmissions(),
  ]);

  return (
    <QuizClient
      initialQuizzes={quizzesRes.data || []}
      initialSubmissions={submissionsRes.data || []}
      currentUser={session.user}
    />
  );
}
