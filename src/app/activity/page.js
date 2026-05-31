import React from "react";
import prisma from "@/lib/prisma";
import ActivityPublicClient from "./ActivityPublicClient";

export const metadata = {
  title: "Activities | SRE UPNVJT",
  description: "Lihat aktivitas dan program kerja unggulan SRE UPNVJT.",
};

export default async function ActivityPage() {
  const dbActivities = await prisma.activity.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" }
  });

  return <ActivityPublicClient activities={dbActivities} />;
}
