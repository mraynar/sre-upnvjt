import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, npm, profilePictureUrl, instagramUrl, linkedinUrl } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const existingEmail = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (existingEmail && existingEmail.id !== parseInt(session.user.id)) {
      return NextResponse.json({ error: "Email is already taken" }, { status: 400 });
    }

    if (npm) {
      const existingNpm = await db.query.user.findFirst({
        where: eq(user.npm, npm),
      });

      if (existingNpm && existingNpm.id !== parseInt(session.user.id)) {
        return NextResponse.json({ error: "NPM is already taken" }, { status: 400 });
      }
    }

    const updateData = {
      name,
      email,
      npm: npm || null,
    };

    if (profilePictureUrl !== undefined) {
      updateData.profilePictureUrl = profilePictureUrl;
    }
    if (instagramUrl !== undefined) {
      updateData.instagramUrl = instagramUrl;
    }
    if (linkedinUrl !== undefined) {
      updateData.linkedinUrl = linkedinUrl;
    }

    await db.update(user).set(updateData).where(eq(user.id, parseInt(session.user.id)));

    const updatedUser = await db.query.user.findFirst({
      where: eq(user.id, parseInt(session.user.id)),
      columns: {
        id: true,
        name: true,
        email: true,
        npm: true,
        profilePictureUrl: true,
        instagramUrl: true,
        linkedinUrl: true,
      },
      with: {
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
