import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { systemSetting } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req) {
  try {
    const settings = await db.select().from(systemSetting);
    
    // Convert array of {keyName, valueData} to a simple object { APP_LANGUAGE: "id", ... }
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.keyName] = curr.valueData;
      return acc;
    }, {});

    return NextResponse.json(settingsMap);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.roleName !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Super Admin only." }, { status: 403 });
    }

    const updates = await req.json(); // { "APP_LANGUAGE": "en", "APP_TITLE": "My App" }

    for (const [key, value] of Object.entries(updates)) {
      // Check if it exists
      const existing = await db.query.systemSetting.findFirst({
        where: eq(systemSetting.keyName, key)
      });

      if (existing) {
        await db.update(systemSetting)
          .set({ valueData: String(value), updatedAt: new Date() })
          .where(eq(systemSetting.keyName, key));
      } else {
        await db.insert(systemSetting).values({
          keyName: key,
          valueData: String(value)
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings Update Error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
