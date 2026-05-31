"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createDocument(data) {
  try {
    const { title, type, url, description } = data;
    
    const doc = await prisma.document.create({
      data: {
        title,
        type: type || "OTHER",
        url,
        description: description || null,
      }
    });
    
    revalidatePath("/documents");
    return { success: true, data: doc };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateDocument(id, data) {
  try {
    const { title, type, url, description } = data;
    
    const doc = await prisma.document.update({
      where: { id },
      data: {
        title,
        type: type || "OTHER",
        url,
        description: description || null,
      }
    });
    
    revalidatePath("/documents");
    return { success: true, data: doc };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteDocument(id) {
  try {
    await prisma.document.delete({ where: { id } });
    revalidatePath("/documents");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
