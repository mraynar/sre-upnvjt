import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eventRegistration } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req, { params }) {
  try {
    const eventId = parseInt(params.id);
    const data = await db.query.eventRegistration.findMany({
      where: (t, { eq }) => eq(t.eventId, eventId),
      orderBy: [eventRegistration.submittedAt],
    });
    return NextResponse.json(data);
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

    const eventId = parseInt(params.id);
    const body = await req.json();
    const { registrationId, status } = body; // status: 'CONFIRMED' | 'REJECTED' | 'PENDING'

    if (!registrationId || !status) {
      return NextResponse.json({ error: "ID registrasi dan status wajib diisi" }, { status: 400 });
    }

    const [updated] = await db.update(eventRegistration)
      .set({ status })
      .where(and(
        eq(eventRegistration.id, parseInt(registrationId)),
        eq(eventRegistration.eventId, eventId)
      ))
      .returning();

    return NextResponse.json({ success: true, registration: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const eventId = parseInt(params.id);
    const body = await req.json();
    const { fullName, email, teamName, registrationType } = body;

    if (!fullName || !email) {
      return NextResponse.json({ error: "Nama lengkap dan email wajib diisi" }, { status: 400 });
    }

    const [result] = await db.insert(eventRegistration).values({
      eventId,
      fullName,
      email,
      teamName: teamName || null,
      registrationType: registrationType || "OPEN",
      status: "PENDING",
      submittedAt: new Date(),
    }).returning();

    return NextResponse.json({ success: true, registration: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

