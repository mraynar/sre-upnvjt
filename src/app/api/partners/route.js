import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { partner } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  try {
    const partners = await db.query.partner.findMany({
      orderBy: [asc(partner.createdAt)]
    });
    return NextResponse.json(partners);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.user.roleName !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Only SUPER_ADMIN can manage partners" }, { status: 403 });
    }

    const body = await req.json();
    const { name, imageUrl, size } = body;

    if (!name || !imageUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [result] = await db.insert(partner).values({
      name,
      imageUrl,
      size: size || "MEDIUM"
    });

    return NextResponse.json({ success: true, partner: { id: result.insertId, name, imageUrl, size: size || "MEDIUM" } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
