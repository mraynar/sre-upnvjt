import React from "react";
import prisma from "@/lib/prisma";
import ActivityClient from "./ActivityClient";

export const metadata = {
  title: "Programs & Activities | SRE Portal",
};

export default async function ActivityPage() {
  const activities = await prisma.activity.findMany({
    orderBy: { createdAt: "desc" }
  });

  return <ActivityClient initialActivities={activities} />;
}
