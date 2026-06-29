import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { literatureCategory } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const categories = await db.query.literatureCategory.findMany({
      orderBy: [asc(literatureCategory.name)],
    });
    return NextResponse.json(categories);
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
    const { name, imageUrl, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Nama kategori wajib diisi" }, { status: 400 });
    }

    const [result] = await db.insert(literatureCategory).values({
      name,
      imageUrl: imageUrl || null,
      description: description || null,
    }).returning();

    return NextResponse.json({ success: true, category: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
