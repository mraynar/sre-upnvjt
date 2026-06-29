import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { taskSubmission, task, memberProfile, xpTransaction } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";

export async function GET(req, { params }) {
  try {
    const taskId = parseInt(params.id);
    const submissions = await db.query.taskSubmission.findMany({
      where: (t, { eq }) => eq(t.taskId, taskId),
      with: {
        member: { columns: { id: true, name: true } },
      },
    });

    return NextResponse.json(submissions);
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

    const taskId = parseInt(params.id);
    const body = await req.json();
    const { submissionId, status, feedback } = body; // status: 'APPROVED' | 'REJECTED'

    if (!submissionId || !status) {
      return NextResponse.json({ error: "ID submisi dan status wajib diisi" }, { status: 400 });
    }

    // Fetch submission & task to verify and get reward details
    const submission = await db.query.taskSubmission.findFirst({
      where: (t, { eq, and }) => and(eq(t.id, parseInt(submissionId)), eq(t.taskId, taskId)),
      with: {
        task: true,
      },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submisi tidak ditemukan" }, { status: 404 });
    }

    const wasApproved = submission.status === "APPROVED";
    const nowApproved = status === "APPROVED";

    const [updated] = await db.update(taskSubmission)
      .set({
        status,
        feedback: feedback || null,
        reviewedById: session.user.id,
      })
      .where(eq(taskSubmission.id, parseInt(submissionId)))
      .returning();

    // Reward XP if transitioned to APPROVED
    if (nowApproved && !wasApproved && submission.task.rewardXp > 0) {
      const profile = await db.query.memberProfile.findFirst({
        where: eq(memberProfile.userId, submission.memberId),
      });

      const gainedXp = submission.task.rewardXp;
      if (!profile) {
        await db.insert(memberProfile).values({
          userId: submission.memberId,
          xp: gainedXp,
          level: 1,
        });
      } else {
        const nextXp = profile.xp + gainedXp;
        const nextLevel = Math.floor(nextXp / 100) + 1;
        await db.update(memberProfile)
          .set({ xp: nextXp, level: nextLevel })
          .where(eq(memberProfile.userId, submission.memberId));
      }

      await db.insert(xpTransaction).values({
        userId: submission.memberId,
        amount: gainedXp,
        reason: `Penyelesaian Tugas: ${submission.task.title}`,
        sourceType: "task",
        sourceId: submission.id,
      });
    }

    return NextResponse.json({ success: true, submission: updated });
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

    const taskId = parseInt(params.id);
    const body = await req.json();
    const { fileUrl } = body;

    if (!fileUrl) {
      return NextResponse.json({ error: "Link file submisi wajib diisi" }, { status: 400 });
    }

    // Check if submission already exists
    const existing = await db.query.taskSubmission.findFirst({
      where: (t, { eq, and }) => and(eq(t.taskId, taskId), eq(t.memberId, parseInt(session.user.id))),
    });

    let result;
    if (existing) {
      // Update existing submission, reset status to PENDING, remove feedback
      const [updated] = await db.update(taskSubmission)
        .set({
          fileUrl,
          status: "PENDING",
          feedback: null,
          reviewedById: null,
          submittedAt: new Date(),
        })
        .where(eq(taskSubmission.id, existing.id))
        .returning();
      result = updated;
    } else {
      // Create new submission
      const [inserted] = await db.insert(taskSubmission).values({
        taskId,
        memberId: parseInt(session.user.id),
        fileUrl,
        status: "PENDING",
        submittedAt: new Date(),
      }).returning();
      result = inserted;
    }

    return NextResponse.json({ success: true, submission: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

