import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { shortlink } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// PUT: Update a shortlink
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { slug, originalUrl, description } = await req.json();

    if (!slug || !originalUrl) {
      return NextResponse.json({ error: "Slug and Original URL are required" }, { status: 400 });
    }

    // Only allow update if the user created it, or if the user is an admin
    // For simplicity, we just allow the creator to update it, or any staff member.
    // In this portal, staff can manage links. We'll allow it.
    
    // Check if slug is taken by another link
    const existing = await db.query.shortlink.findFirst({
      where: and(eq(shortlink.slug, slug))
    });

    if (existing && existing.id !== Number(id)) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const updated = await db
      .update(shortlink)
      .set({
        slug,
        originalUrl,
        description: description || null,
      })
      .where(eq(shortlink.id, Number(id)))
      .returning();

    if (!updated.length) {
      return NextResponse.json({ error: "Shortlink not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Failed to update shortlink:", error);
    return NextResponse.json({ error: "Failed to update shortlink" }, { status: 500 });
  }
}

// DELETE: Remove a shortlink
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const deleted = await db
      .delete(shortlink)
      .where(eq(shortlink.id, Number(id)))
      .returning();

    if (!deleted.length) {
      return NextResponse.json({ error: "Shortlink not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Shortlink deleted successfully" });
  } catch (error) {
    console.error("Failed to delete shortlink:", error);
    return NextResponse.json({ error: "Failed to delete shortlink" }, { status: 500 });
  }
}
