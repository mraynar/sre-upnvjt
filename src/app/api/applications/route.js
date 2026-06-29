import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { memberApplication } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.roleName !== "SUPER_ADMIN" && session.user.roleName !== "STAFF_HR") {
      return NextResponse.json({ error: "Forbidden: Admin access only" }, { status: 403 });
    }

    const data = await db.query.memberApplication.findMany({
      orderBy: [desc(memberApplication.appliedAt)],
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, email, npm, faculty, motivation } = body;

    if (!fullName || !email || !npm || !faculty || !motivation) {
      return NextResponse.json({ error: "Semua formulir wajib diisi" }, { status: 400 });
    }

    const [result] = await db.insert(memberApplication).values({
      fullName,
      email,
      npm,
      faculty,
      motivation,
      status: "PENDING",
      appliedAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return NextResponse.json({ success: true, application: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
