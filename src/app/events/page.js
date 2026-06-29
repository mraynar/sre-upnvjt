import React from "react";
import { db } from "@/lib/db";
import { event } from "@/db/schema";
import { desc } from "drizzle-orm";
import EventsClient from "./EventsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Events & Kegiatan | SRE UPNVJT",
  description: "Daftar kegiatan, seminar, lomba, dan workshop yang diselenggarakan oleh SRE UPNVJT.",
};

export default async function PublicEventsPage() {
  const data = await db.query.event.findMany({
    orderBy: [desc(event.eventDate)],
  });

  return <EventsClient initialEvents={data} />;
}
