import React from "react";
import db from "@/lib/prisma";
import { activity } from "@/db/schema";
import { desc } from "drizzle-orm";
import ActivityClient from "./ActivityClient";

export const metadata = {
  title: "Programs & Activities | SRE Portal",
};

export default async function ActivityPage() {
  const activities = await db.query.activity.findMany({
    orderBy: [desc(activity.createdAt)]
  });

  return <ActivityClient initialActivities={activities} />;
}
