import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { memberApplication } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.roleName !== "SUPER_ADMIN" && session.user.roleName !== "STAFF_HR") {
      return NextResponse.json({ error: "Forbidden: Admin access only" }, { status: 403 });
    }

    const id = parseInt(params.id);
    const body = await req.json();
    const { status } = body; // APPROVED | REJECTED

    if (!status || (status !== "APPROVED" && status !== "REJECTED")) {
      return NextResponse.json({ error: "Status peninjauan tidak valid" }, { status: 400 });
    }

    const [updated] = await db.update(memberApplication)
      .set({
        status,
        reviewedById: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(memberApplication.id, id))
      .returning();

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
