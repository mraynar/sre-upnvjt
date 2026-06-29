import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { testimonial } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const data = await db.query.testimonial.findMany({
      where: eq(testimonial.isPublished, true),
      orderBy: [desc(testimonial.createdAt)],
    });
    return NextResponse.json(data);
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
    const { authorName, authorPosition, authorPhotoUrl, content, isPublished } = body;

    if (!authorName || !authorPosition || !content) {
      return NextResponse.json({ error: "Nama, jabatan, dan isi testimoni wajib diisi" }, { status: 400 });
    }

    const [result] = await db.insert(testimonial).values({
      authorName,
      authorPosition,
      authorPhotoUrl: authorPhotoUrl || null,
      content,
      isPublished: Boolean(isPublished),
    }).returning();

    return NextResponse.json({ success: true, testimonial: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
