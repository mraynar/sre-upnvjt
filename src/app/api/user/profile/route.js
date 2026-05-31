import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, npm } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail && existingEmail.id !== parseInt(session.user.id)) {
      return NextResponse.json({ error: "Email is already taken" }, { status: 400 });
    }

    if (npm) {
      const existingNpm = await prisma.user.findUnique({
        where: { npm },
      });

      if (existingNpm && existingNpm.id !== parseInt(session.user.id)) {
        return NextResponse.json({ error: "NPM is already taken" }, { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: {
        name,
        email,
        npm: npm || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        npm: true,
        role: true,
        department: true,
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
