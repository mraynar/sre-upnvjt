import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { formTemplate } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // verify

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const formId = parseInt(id, 10);
    
    if (isNaN(formId)) {
      return NextResponse.json({ error: 'Invalid form ID' }, { status: 400 });
    }

    const form = await db.query.formTemplate.findFirst({
      where: eq(formTemplate.id, formId),
      with: {
        createdBy: true,
      }
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error('Error fetching form details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const formId = parseInt(id, 10);
    const body = await req.json();
    const { title, description, questions } = body;

    const [updatedForm] = await db.update(formTemplate)
      .set({
        title,
        description,
        questions,
        updatedAt: new Date(),
      })
      .where(eq(formTemplate.id, formId))
      .returning();

    if (!updatedForm) {
       return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json(updatedForm);
  } catch (error) {
    console.error('Error updating form:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const formId = parseInt(id, 10);

    const [deletedForm] = await db.delete(formTemplate)
      .where(eq(formTemplate.id, formId))
      .returning();

    if (!deletedForm) {
       return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedForm });
  } catch (error) {
    console.error('Error deleting form:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
