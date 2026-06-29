import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { hasAccess } from "@/lib/permissions";
import { db } from "@/lib/db";
import { event, eventRegistration } from "@/db/schema";
import { desc } from "drizzle-orm";
import EventsAdminClient from "./EventsAdminClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Events Management | SRE Portal",
  description: "Kelola kegiatan, pendaftaran peserta, dan logistis event SRE UPNVJT.",
};

export default async function EventsAdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");
  if (!hasAccess(session.user, "events", "read")) {
    redirect("/dashboard");
  }

  // Fetch all events
  const events = await db.query.event.findMany({
    orderBy: [desc(event.eventDate)],
  });

  // Fetch registrations
  const registrations = await db.query.eventRegistration.findMany({
    with: {
      event: { columns: { id: true, title: true } },
    },
    orderBy: [desc(eventRegistration.submittedAt)],
  });

  return (
    <EventsAdminClient
      initialEvents={events}
      initialRegistrations={registrations}
      currentUser={session.user}
    />
  );
}
