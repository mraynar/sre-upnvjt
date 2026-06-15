"use server";

import { db } from "@/lib/db";
import { article } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createArticle(data) {
  try {
    const { title, slug, content, excerpt, thumbnailUrl, isPublished, authorId } = data;
    
    const existing = await db.query.article.findFirst({ where: eq(article.slug, slug) });
    if (existing) return { success: false, error: "Slug (URL) sudah digunakan. Gunakan judul lain." };

    const [result] = await db.insert(article).values({
      title,
      slug,
      content,
      excerpt: excerpt || null,
      thumbnailUrl: thumbnailUrl || null,
      isPublished: isPublished === "true" || isPublished === true,
      authorId: parseInt(authorId),
    });
    
    const newArticle = { id: result.insertId, title, slug, content };

    revalidatePath("/articles");
    return { success: true, data: newArticle };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateArticle(id, data) {
  try {
    const { title, slug, content, excerpt, thumbnailUrl, isPublished } = data;
    
    const existing = await db.query.article.findFirst({ where: eq(article.slug, slug) });
    if (existing && existing.id !== id) {
      return { success: false, error: "Slug (URL) sudah digunakan. Gunakan judul lain." };
    }

    await db.update(article).set({
      title,
      slug,
      content,
      excerpt: excerpt || null,
      thumbnailUrl: thumbnailUrl || null,
      isPublished: isPublished === "true" || isPublished === true,
    }).where(eq(article.id, id));
    
    revalidatePath("/articles");
    return { success: true, data: { id, title, slug } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteArticle(id) {
  try {
    await db.delete(article).where(eq(article.id, id));
    revalidatePath("/articles");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getPublicArticles() {
  try {
    const articles = await db.query.article.findMany({
      where: eq(article.isPublished, true),
      with: { author: { columns: { name: true } } },
      orderBy: [desc(article.createdAt)],
      limit: 4
    });
    return { success: true, data: articles };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
