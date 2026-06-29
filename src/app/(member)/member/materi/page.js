import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { pptModule, pptSlide } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import MateriClient from "./MateriClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Materi PPT Pembelajaran | SRE Portal",
  description: "Akses materi pembelajaran dan modul slide presentasi SRE UPNVJT.",
};

export default async function MemberMateriPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Fetch only published modules with slide count
  const modules = await db
    .select({
      id: pptModule.id,
      title: pptModule.title,
      description: pptModule.description,
      coverImageUrl: pptModule.coverImageUrl,
      isPublished: pptModule.isPublished,
      createdById: pptModule.createdById,
      createdAt: pptModule.createdAt,
      slideCount: count(pptSlide.id),
    })
    .from(pptModule)
    .leftJoin(pptSlide, eq(pptSlide.moduleId, pptModule.id))
    .where(eq(pptModule.isPublished, true))
    .groupBy(pptModule.id)
    .orderBy(pptModule.createdAt);

  return <MateriClient initialModules={modules} />;
}
