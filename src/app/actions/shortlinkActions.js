"use server";

import { db } from "@/lib/db";
import { shortlink, user } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { hasAccess } from "@/lib/permissions";

export async function getShortlinks() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !hasAccess(session.user, "shortlinks", "read")) {
      return { success: false, error: "Unauthorized" };
    }

    const data = await db.query.shortlink.findMany({
      orderBy: [desc(shortlink.createdAt)],
      with: {
        createdBy: {
          columns: {
            id: true,
            name: true,
          }
        }
      }
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch shortlinks:", error);
    return { success: false, error: "Failed to fetch shortlinks" };
  }
}

export async function createShortlink(data) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !hasAccess(session.user, "shortlinks", "create")) {
      return { success: false, error: "Unauthorized" };
    }

    // Get real user ID from DB
    const currentUser = await db.query.user.findFirst({
      where: eq(user.email, session.user.email)
    });

    if (!currentUser) {
      return { success: false, error: "User not found in database" };
    }

    // Check slug uniqueness
    const existing = await db.query.shortlink.findFirst({
      where: eq(shortlink.slug, data.slug),
    });

    if (existing) {
      return { success: false, error: "Slug is already in use" };
    }

    await db.insert(shortlink).values({
      slug: data.slug,
      originalUrl: data.originalUrl,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdById: currentUser.id,
      createdAt: new Date(),
    });

    revalidatePath("/shortlinks");
    return { success: true };
  } catch (error) {
    console.error("Failed to create shortlink:", error);
    return { success: false, error: "Failed to create shortlink" };
  }
}

export async function updateShortlink(id, data) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !hasAccess(session.user, "shortlinks", "update")) {
      return { success: false, error: "Unauthorized" };
    }

    // If updating slug, check uniqueness
    if (data.slug) {
      const existing = await db.query.shortlink.findFirst({
        where: eq(shortlink.slug, data.slug),
      });

      if (existing && existing.id !== id) {
        return { success: false, error: "Slug is already in use" };
      }
    }

    await db.update(shortlink)
      .set({
        ...data,
      })
      .where(eq(shortlink.id, id));

    revalidatePath("/shortlinks");
    return { success: true };
  } catch (error) {
    console.error("Failed to update shortlink:", error);
    return { success: false, error: "Failed to update shortlink" };
  }
}

export async function deleteShortlink(id) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !hasAccess(session.user, "shortlinks", "delete")) {
      return { success: false, error: "Unauthorized" };
    }

    await db.delete(shortlink).where(eq(shortlink.id, id));

    revalidatePath("/shortlinks");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete shortlink:", error);
    return { success: false, error: "Failed to delete shortlink" };
  }
}
