"use server";

import { db } from "@/lib/db";
import { document } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createDocument(data) {
  try {
    const { title, type, url, description } = data;
    
    const [result] = await db.insert(document).values({
      title,
      type: type || "OTHER",
      url,
      description: description || null,
    });
    
    revalidatePath("/documents");
    return { success: true, data: { id: result.insertId, title, type, url, description } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateDocument(id, data) {
  try {
    const { title, type, url, description } = data;
    
    await db.update(document).set({
      title,
      type: type || "OTHER",
      url,
      description: description || null,
    }).where(eq(document.id, id));
    
    revalidatePath("/documents");
    return { success: true, data: { id, title, type, url, description } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteDocument(id) {
  try {
    await db.delete(document).where(eq(document.id, id));
    revalidatePath("/documents");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
