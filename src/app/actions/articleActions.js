"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createArticle(data) {
  try {
    const { title, slug, content, excerpt, thumbnailUrl, isPublished, authorId } = data;
    
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) return { success: false, error: "Slug (URL) sudah digunakan. Gunakan judul lain." };

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        thumbnailUrl: thumbnailUrl || null,
        isPublished: isPublished === "true" || isPublished === true,
        authorId: parseInt(authorId),
      }
    });
    
    revalidatePath("/articles");
    return { success: true, data: article };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateArticle(id, data) {
  try {
    const { title, slug, content, excerpt, thumbnailUrl, isPublished } = data;
    
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      return { success: false, error: "Slug (URL) sudah digunakan. Gunakan judul lain." };
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        thumbnailUrl: thumbnailUrl || null,
        isPublished: isPublished === "true" || isPublished === true,
      }
    });
    
    revalidatePath("/articles");
    return { success: true, data: article };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteArticle(id) {
  try {
    await prisma.article.delete({ where: { id } });
    revalidatePath("/articles");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
