"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createActivity(data) {
  try {
    const { title, description, imageUrl, isPublished } = data;
    
    const activity = await prisma.activity.create({
      data: {
        title,
        description,
        imageUrl,
        isPublished: isPublished || false,
      }
    });

    revalidatePath("/activity");
    revalidatePath("/");
    return { success: true, activity };
  } catch (error) {
    console.error("Error creating activity:", error);
    return { success: false, error: error.message };
  }
}

export async function updateActivity(id, data) {
  try {
    const { title, description, imageUrl, isPublished } = data;
    
    const activity = await prisma.activity.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl,
        isPublished,
      }
    });

    revalidatePath("/activity");
    revalidatePath("/");
    return { success: true, activity };
  } catch (error) {
    console.error("Error updating activity:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteActivity(id) {
  try {
    await prisma.activity.delete({
      where: { id }
    });

    revalidatePath("/activity");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting activity:", error);
    return { success: false, error: error.message };
  }
}
