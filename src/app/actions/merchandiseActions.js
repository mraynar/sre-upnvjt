"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createMerchandise(data) {
  try {
    const { name, price, description, imageUrl, linkUrl, isAvailable } = data;
    
    const merch = await prisma.merchandise.create({
      data: {
        name,
        price,
        description,
        imageUrl,
        linkUrl,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
      }
    });

    revalidatePath("/merchandise");
    revalidatePath("/");
    return { success: true, merchandise: merch };
  } catch (error) {
    console.error("Error creating merchandise:", error);
    return { success: false, error: error.message };
  }
}

export async function updateMerchandise(id, data) {
  try {
    const { name, price, description, imageUrl, linkUrl, isAvailable } = data;
    
    const merch = await prisma.merchandise.update({
      where: { id },
      data: {
        name,
        price,
        description,
        imageUrl,
        linkUrl,
        isAvailable,
      }
    });

    revalidatePath("/merchandise");
    revalidatePath("/");
    return { success: true, merchandise: merch };
  } catch (error) {
    console.error("Error updating merchandise:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteMerchandise(id) {
  try {
    await prisma.merchandise.delete({
      where: { id }
    });

    revalidatePath("/merchandise");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting merchandise:", error);
    return { success: false, error: error.message };
  }
}
