import React from "react";
import prisma from "@/lib/prisma";
import DocumentsClient from "./DocumentsClient";

export const metadata = {
  title: "Bank Data & Dokumen | SRE Portal",
};

export default async function DocumentsPage() {
  const docs = await prisma.document.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <DocumentsClient initialDocs={docs} />
  );
}
