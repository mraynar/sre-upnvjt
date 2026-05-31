import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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

    const updatedRole = await prisma.role.update({
      where: { id: parseInt(id) },
      data: {
        name,
        permissions: permissions || {},
      },
    });

    return NextResponse.json(updatedRole);
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
    
    const role = await prisma.role.findUnique({ where: { id: parseInt(id) } });
    if (role?.name === "SUPER_ADMIN") {
      return NextResponse.json({ error: "Cannot delete SUPER_ADMIN role" }, { status: 400 });
    }

    await prisma.role.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
