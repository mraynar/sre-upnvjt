import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { formTemplate } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Need to check if this path is right

export async function GET(req) {
  try {
    // Attempting to retrieve session. If not available, we can mock it or check middleware later.
    const forms = await db.select().from(formTemplate).orderBy(desc(formTemplate.createdAt));
    return NextResponse.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || 1; // Fallback to 1 if not logged in just in case

    const body = await req.json();
    const { title, description, questions } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const [newForm] = await db.insert(formTemplate).values({
      title,
      description,
      questions: questions || [],
      createdById: userId,
    }).returning();

    return NextResponse.json(newForm, { status: 201 });
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
