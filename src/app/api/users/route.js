import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await db.query.user.findMany({
      where: eq(user.isActive, true),
      columns: {
        id: true,
        name: true,
        positionName: true,
      },
      with: {
        department: { columns: { name: true } },
      },
      orderBy: [asc(user.name)]
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
