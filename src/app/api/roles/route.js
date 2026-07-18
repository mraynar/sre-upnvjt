import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { role } from "@/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.roleName !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const roles = await db.query.role.findMany({
      with: {
        users: { columns: { id: true } }
      }
    });
    
    const formattedRoles = roles.map(r => {
      const { users, ...rest } = r;
      return { ...rest, _count: { users: users.length } };
    });
    
    return NextResponse.json(formattedRoles);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.roleName !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, permissions } = body;

    const [result] = await db.insert(role).values({
      name,
      permissions: permissions || {},
    }).returning({ id: role.id });

    return NextResponse.json({ id: result.id, name, permissions: permissions || {} });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
