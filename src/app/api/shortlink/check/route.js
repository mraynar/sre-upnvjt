import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { shortlink } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ available: false }, { status: 400 });
    }

    // Check if slug exists
    const existing = await db.select().from(shortlink).where(eq(shortlink.slug, slug)).limit(1);
    
    return NextResponse.json({ available: existing.length === 0 });
  } catch (error) {
    console.error('Error checking shortlink availability:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
