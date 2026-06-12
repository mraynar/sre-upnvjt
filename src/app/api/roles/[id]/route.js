import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { role } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.roleName !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, permissions } = body;

    await db.update(role).set({
      name,
      permissions: permissions || {},
    }).where(eq(role.id, parseInt(id)));

    return NextResponse.json({ id: parseInt(id), name, permissions: permissions || {} });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.roleName !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    
    const foundRole = await db.query.role.findFirst({ where: eq(role.id, parseInt(id)) });
    if (foundRole?.name === "SUPER_ADMIN") {
      return NextResponse.json({ error: "Cannot delete SUPER_ADMIN role" }, { status: 400 });
    }

    await db.delete(role).where(eq(role.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
