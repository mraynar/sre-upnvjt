"use server";

import { db } from "@/lib/db";
import { finance } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createFinanceRecord(data) {
  try {
    const { title, amount, type, proofUrl, date, loggedById, projectId } = data;
    
    const [result] = await db.insert(finance).values({
      title,
      amount: parseFloat(amount),
      type,
      proofUrl: proofUrl || null,
      date: new Date(date),
      loggedById: parseInt(loggedById),
      projectId: projectId ? parseInt(projectId) : null
    });
    
    revalidatePath("/finance");
    return { success: true, data: { id: result.insertId, title, amount } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateFinanceRecord(id, data) {
  try {
    const { title, amount, type, proofUrl, date, projectId } = data;
    
    await db.update(finance).set({
      title,
      amount: parseFloat(amount),
      type,
      proofUrl: proofUrl || null,
      date: new Date(date),
      projectId: projectId ? parseInt(projectId) : null
    }).where(eq(finance.id, id));
    
    revalidatePath("/finance");
    return { success: true, data: { id, title, amount } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteFinanceRecord(id) {
  try {
    await db.delete(finance).where(eq(finance.id, id));
    revalidatePath("/finance");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
