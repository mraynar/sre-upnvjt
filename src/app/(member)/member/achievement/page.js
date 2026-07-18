import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { memberProfile, xpTransaction, taskSubmission, attendance, quizSubmission } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import AchievementClient from "./AchievementClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Achievement | SRE Portal",
  description: "Pantau pencapaian, badge, dan riwayat XP kamu di SRE UPNVJT.",
};

export default async function AchievementPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = parseInt(session.user.id);

  const [profile, xpLogs, taskSubs, attendances, quizSubs] = await Promise.all([
    db.query.memberProfile.findFirst({ where: eq(memberProfile.userId, userId) }),
    db.query.xpTransaction.findMany({
      where: eq(xpTransaction.userId, userId),
      orderBy: [desc(xpTransaction.createdAt)],
    }),
    db.query.taskSubmission.findMany({
      where: and(eq(taskSubmission.memberId, userId), eq(taskSubmission.status, "APPROVED")),
      with: { task: { columns: { title: true, rewardXp: true } } },
    }),
    db.query.attendance.findMany({
      where: eq(attendance.memberId, userId),
      with: { session: { columns: { title: true, date: true } } },
    }),
    db.query.quizSubmission.findMany({
      where: eq(quizSubmission.memberId, userId),
      with: { quiz: { columns: { title: true, rewardXp: true } } },
    }),
  ]);

  return (
    <AchievementClient
      profile={profile}
      xpLogs={xpLogs}
      taskSubs={taskSubs}
      attendances={attendances}
      quizSubs={quizSubs}
    />
  );
}
