import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { attendance } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    const body = await req.json();
    const { status, notes, date, memberId } = body;

    if (!status || !date || !memberId) {
      return NextResponse.json({ error: "Anggota, tanggal, dan status absensi wajib diisi" }, { status: 400 });
    }

    await db.update(attendance)
      .set({
        memberId: parseInt(memberId),
        date: new Date(date),
        status,
        notes: notes || null,
      })
      .where(eq(attendance.id, id));

    const updated = await db.query.attendance.findFirst({
      where: (t, { eq }) => eq(t.id, id),
      with: { member: { columns: { id: true, name: true, npm: true } } },
    });

    return NextResponse.json({ success: true, attendance: updated });
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
    await db.delete(attendance).where(eq(attendance.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
