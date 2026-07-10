import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { shortlink } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(req, { params }) {
  const { slug } = await params;

  try {
    const link = await db.select().from(shortlink).where(eq(shortlink.slug, slug)).limit(1);

    if (link.length === 0) {
      // If not found, redirect to a 404 page or home
      return NextResponse.redirect(new URL('/404', req.url));
    }

    const { originalUrl, id } = link[0];

    // Increment clicks
    await db.update(shortlink)
      .set({ clicks: sql`COALESCE(${shortlink.clicks}, 0) + 1` })
      .where(eq(shortlink.id, id));

    // Redirect to original URL
    return NextResponse.redirect(originalUrl);
  } catch (error) {
    console.error('Error redirecting shortlink:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
