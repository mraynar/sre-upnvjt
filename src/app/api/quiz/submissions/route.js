import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quizSubmission } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.roleName !== "SUPER_ADMIN" && session.user.roleName !== "STAFF_HR") {
      return NextResponse.json({ error: "Forbidden: Admin access only" }, { status: 403 });
    }

    const submissions = await db.query.quizSubmission.findMany({
      with: {
        member: { columns: { id: true, name: true } },
        quiz: { columns: { id: true, title: true, passingScore: true, rewardXp: true } },
        gradedBy: { columns: { id: true, name: true } },
      },
      orderBy: [desc(quizSubmission.submittedAt)],
    });

    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
