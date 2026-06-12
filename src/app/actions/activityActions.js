"use server";

import db from "@/lib/prisma";
import { activity } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createActivity(data) {
  try {
    const { title, description, imageUrl, isPublished } = data;
    
    const [result] = await db.insert(activity).values({
      title,
      description,
      imageUrl,
      isPublished: isPublished || false,
    });

    const newActivity = {
      id: result.insertId,
      title,
      description,
      imageUrl,
      isPublished: isPublished || false,
    };

    revalidatePath("/activity");
    revalidatePath("/");
    return { success: true, activity: newActivity };
  } catch (error) {
    console.error("Error creating activity:", error);
    return { success: false, error: error.message };
  }
}

export async function updateActivity(id, data) {
  try {
    const { title, description, imageUrl, isPublished } = data;
    
    await db.update(activity)
      .set({
        title,
        description,
        imageUrl,
        isPublished,
      })
      .where(eq(activity.id, id));

    revalidatePath("/activity");
    revalidatePath("/");
    return { success: true, activity: { id, ...data } };
  } catch (error) {
    console.error("Error updating activity:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteActivity(id) {
  try {
    await db.delete(activity).where(eq(activity.id, id));

    revalidatePath("/activity");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting activity:", error);
    return { success: false, error: error.message };
  }
}

export async function getPublicActivities() {
  try {
    const activities = await db.select()
      .from(activity)
      .where(eq(activity.isPublished, true))
      .orderBy(desc(activity.createdAt));
      
    return { success: true, data: activities };
  } catch (error) {
    console.error("Error fetching activities:", error);
    return { success: false, error: error.message };
  }
}
