import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pptSlide } from "@/db/schema";
import { eq, asc, max } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";

export async function GET(req, { params }) {
  try {
    const moduleId = parseInt(params.id);
    const slides = await db.query.pptSlide.findMany({
      where: (t, { eq }) => eq(t.moduleId, moduleId),
      orderBy: [asc(pptSlide.order)],
    });
    return NextResponse.json(slides);
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

    const moduleId = parseInt(params.id);
    const body = await req.json();
    const { title, driveUrl, notes } = body;

    if (!driveUrl) {
      return NextResponse.json({ error: "Google Drive Embed URL wajib diisi" }, { status: 400 });
    }

    // Auto-assign order as max+1
    const [{ maxOrder }] = await db
      .select({ maxOrder: max(pptSlide.order) })
      .from(pptSlide)
      .where(eq(pptSlide.moduleId, moduleId));

    const nextOrder = (maxOrder ?? 0) + 1;

    const [result] = await db.insert(pptSlide).values({
      moduleId,
      order: nextOrder,
      title: title || null,
      driveUrl,
      notes: notes || null,
    }).returning();

    return NextResponse.json({ success: true, slide: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
