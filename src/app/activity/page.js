import React from "react";
import db from "@/lib/prisma";
import { activity } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import ActivityPublicClient from "./ActivityPublicClient";

export const metadata = {
  title: "Activities | SRE UPNVJT",
  description: "Lihat aktivitas dan program kerja unggulan SRE UPNVJT.",
};

export default async function ActivityPage() {
  const dbActivities = await db.query.activity.findMany({
    where: eq(activity.isPublished, true),
    orderBy: [desc(activity.createdAt)]
  });

  return <ActivityPublicClient activities={dbActivities} />;
}
