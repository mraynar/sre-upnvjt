import React from "react";
import db from "@/lib/prisma";
import { document } from "@/db/schema";
import { desc } from "drizzle-orm";
import DocumentsClient from "./DocumentsClient";

export const metadata = {
  title: "Bank Data & Dokumen | SRE Portal",
};

export default async function DocumentsPage() {
  const docs = await db.query.document.findMany({
    orderBy: [desc(document.createdAt)]
  });

  return (
    <DocumentsClient initialDocs={docs} />
  );
}
