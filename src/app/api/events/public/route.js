import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { event } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.query.event.findMany({
      orderBy: [desc(event.eventDate)],
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
