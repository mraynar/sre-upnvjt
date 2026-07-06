import React from "react";
import MateriDetailClient from "./MateriDetailClient";
import { db } from "@/lib/db";
import { eq, asc } from "drizzle-orm";
import { pptModule, pptSlide } from "@/db/schema";
import { redirect } from "next/navigation";

export default async function MateriDetailPage({ params }) {
  const { id } = await params;

  // Fetch module data on the server side to eliminate loading waterfalls
  const moduleData = await db.query.pptModule.findFirst({
    where: eq(pptModule.id, parseInt(id)),
  });

  if (!moduleData) {
    redirect('/member/materi'); // Redirect if not found
  }

  // Fetch slides
  const slidesData = await db.query.pptSlide.findMany({
    where: eq(pptSlide.moduleId, parseInt(id)),
    orderBy: [asc(pptSlide.order)],
  });

  const fullData = {
    ...moduleData,
    slides: slidesData,
  };

  const r2Url = process.env.R2_PUBLIC_URL || '';

  return <MateriDetailClient initialData={fullData} r2Url={r2Url} />;
}
