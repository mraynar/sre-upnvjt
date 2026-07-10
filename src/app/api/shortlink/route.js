import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { shortlink, user } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route'; // Adjust if authOptions is elsewhere

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const links = await db.select({
      id: shortlink.id,
      slug: shortlink.slug,
      originalUrl: shortlink.originalUrl,
      description: shortlink.description,
      clicks: shortlink.clicks,
      createdAt: shortlink.createdAt,
      creatorName: user.name,
    })
    .from(shortlink)
    .leftJoin(user, eq(shortlink.createdById, user.id))
    .orderBy(desc(shortlink.createdAt));

    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching shortlinks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug, originalUrl, description } = await req.json();

    if (!slug || !originalUrl) {
      return NextResponse.json({ error: 'Slug and Original URL are required' }, { status: 400 });
    }

    // Check if slug exists
    const existing = await db.select().from(shortlink).where(eq(shortlink.slug, slug));
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Slug is already in use' }, { status: 409 });
    }

    const newLink = await db.insert(shortlink).values({
      slug,
      originalUrl,
      description,
      createdById: parseInt(session.user.id, 10)
    }).returning();

    return NextResponse.json(newLink[0], { status: 201 });
  } catch (error) {
    console.error('Error creating shortlink:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
