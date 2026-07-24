import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { attendanceSession, attendance } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req, { params }) {
  try {
    const sessionUser = await getServerSession(authOptions);
    if (!sessionUser?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const p = await params;
    const id = parseInt(p.id);
    const body = await req.json();
    const { title, description, date, startTime, endTime, token, isActive } = body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = new Date(date);
    if (startTime !== undefined) updateData.startTime = startTime ? new Date(startTime) : null;
    if (endTime !== undefined) updateData.endTime = endTime ? new Date(endTime) : null;
    if (token !== undefined) updateData.token = token || null;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    await db.update(attendanceSession)
      .set(updateData)
      .where(eq(attendanceSession.id, id));

    const updated = await db.query.attendanceSession.findFirst({
      where: eq(attendanceSession.id, id),
      with: {
        createdBy: { columns: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, session: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const sessionUser = await getServerSession(authOptions);
    if (!sessionUser?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const p = await params;
    const id = parseInt(p.id);

    // Delete dependent attendance records first
    await db.delete(attendance).where(eq(attendance.sessionId, id));
    // Delete session
    await db.delete(attendanceSession).where(eq(attendanceSession.id, id));

    return NextResponse.json({ success: true, message: "Sesi presensi dan data absensi terkait berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
