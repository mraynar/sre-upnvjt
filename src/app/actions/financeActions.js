"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createFinanceRecord(data) {
  try {
    const { title, amount, type, proofUrl, date, loggedById, projectId } = data;
    
    const record = await prisma.finance.create({
      data: {
        title,
        amount: parseFloat(amount),
        type,
        proofUrl: proofUrl || null,
        date: new Date(date),
        loggedById: parseInt(loggedById),
        projectId: projectId ? parseInt(projectId) : null
      }
    });
    
    revalidatePath("/finance");
    return { success: true, data: record };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateFinanceRecord(id, data) {
  try {
    const { title, amount, type, proofUrl, date, projectId } = data;
    
    const record = await prisma.finance.update({
      where: { id },
      data: {
        title,
        amount: parseFloat(amount),
        type,
        proofUrl: proofUrl || null,
        date: new Date(date),
        projectId: projectId ? parseInt(projectId) : null
      }
    });
    
    revalidatePath("/finance");
    return { success: true, data: record };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteFinanceRecord(id) {
  try {
    await prisma.finance.delete({ where: { id } });
    revalidatePath("/finance");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
