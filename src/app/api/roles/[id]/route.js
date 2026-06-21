import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { role, user } from "@/db/schema";
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

    // Check if role is assigned to any users
    const usersWithRole = await db.query.user.findFirst({ where: eq(user.roleId, parseInt(id)) });
    if (usersWithRole) {
      return NextResponse.json({ error: "Cannot delete role because it is still assigned to existing users." }, { status: 400 });
    }

    await db.delete(role).where(eq(role.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting role:", error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return NextResponse.json({ error: "Cannot delete role because it is referenced by other records." }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
