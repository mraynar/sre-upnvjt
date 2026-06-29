import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pptModule, pptSlide } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);
    const mod = await db.query.pptModule.findFirst({
      where: (t, { eq }) => eq(t.id, id),
      with: {
        slides: { orderBy: [asc(pptSlide.order)] },
      },
    });

    if (!mod) return NextResponse.json({ error: "Module not found" }, { status: 404 });
    return NextResponse.json(mod);
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

    const id = parseInt(params.id);
    const body = await req.json();
    const { title, description, coverImageUrl, isPublished } = body;

    if (!title) {
      return NextResponse.json({ error: "Judul modul wajib diisi" }, { status: 400 });
    }

    const [updated] = await db.update(pptModule)
      .set({
        title,
        description: description || null,
        coverImageUrl: coverImageUrl || null,
        isPublished: Boolean(isPublished),
        updatedAt: new Date(),
      })
      .where(eq(pptModule.id, id))
      .returning();

    return NextResponse.json({ success: true, module: updated });
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
    // Delete slides first (FK constraint)
    await db.delete(pptSlide).where(eq(pptSlide.moduleId, id));
    await db.delete(pptModule).where(eq(pptModule.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
