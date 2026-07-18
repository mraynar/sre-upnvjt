import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { documentItem, documentCategory } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import DokumenClient from "./DokumenClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Upload Dokumentasi | SRE Portal",
  description: "Upload dan kelola dokumentasi kegiatan SRE UPNVJT ke Google Drive.",
};

export default async function DokumenPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Ambil semua kategori dokumen
  const categories = await db.query.documentCategory.findMany({
    orderBy: [desc(documentCategory.createdAt)],
  });

  // Ambil dokumen milik user ini
  const myDocuments = await db.query.documentItem.findMany({
    where: eq(documentItem.uploadedById, parseInt(session.user.id)),
    orderBy: [desc(documentItem.createdAt)],
    with: { category: true },
  });

  return <DokumenClient categories={categories} initialDocuments={myDocuments} />;
}
