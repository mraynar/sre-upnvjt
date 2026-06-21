import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { shortlink } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  try {
    const linkData = await db.query.shortlink.findFirst({
      where: eq(shortlink.slug, slug),
    });

    if (linkData && linkData.isActive) {
      // Increment clicks
      await db.update(shortlink)
        .set({ clicks: linkData.clicks + 1 })
        .where(eq(shortlink.id, linkData.id));

      // Redirect to original URL
      // We use 302 Temporary Redirect so that clicks are always tracked.
      // If we used 301, the browser would cache the redirect.
      return NextResponse.redirect(linkData.originalUrl, 302);
    }
  } catch (error) {
    console.error("Error redirecting shortlink:", error);
  }

  // If not found or inactive, redirect to home or a not-found page
  return NextResponse.redirect(new URL("/", request.url));
}
