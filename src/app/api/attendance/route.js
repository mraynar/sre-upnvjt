import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { attendance } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const records = await db.query.attendance.findMany({
      with: {
        member: { columns: { id: true, name: true, npm: true } },
      },
      orderBy: [desc(attendance.date)],
    });

    return NextResponse.json(records);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { memberId, date, status, notes } = body;

    if (!memberId || !status || !date) {
      return NextResponse.json({ error: "Anggota, tanggal, dan status absensi wajib diisi" }, { status: 400 });
    }

    const [result] = await db.insert(attendance).values({
      memberId: parseInt(memberId),
      date: new Date(date),
      status,
      notes: notes || null,
    }).returning();

    // fetch relation for return value
    const full = await db.query.attendance.findFirst({
      where: (t, { eq }) => eq(t.id, result.id),
      with: { member: { columns: { id: true, name: true, npm: true } } },
    });

    return NextResponse.json({ success: true, attendance: full }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
