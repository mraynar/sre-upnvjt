import React from "react";
import ActivityPublicClient from "./ActivityPublicClient";
import { activityService } from "@/lib/services/activityService";

export const revalidate = 0; // Ensure fresh data on request

export default async function ActivityPage() {
  let activities = [];
  try {
    activities = await activityService.getAllActivities();
  } catch (error) {
    console.error("Error fetching activities for public page:", error);
  }

  return <ActivityPublicClient activities={activities} />;
}
