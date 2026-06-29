import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { hasAccess } from "@/lib/permissions";
import { db } from "@/lib/db";
import { testimonial } from "@/db/schema";
import { desc } from "drizzle-orm";
import TestimonialsClient from "./TestimonialsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Testimonials Management | SRE Portal",
  description: "Kelola review dan testimoni yang ditampilkan di halaman beranda.",
};

export default async function TestimonialsAdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");
  if (!hasAccess(session.user, "content", "read")) {
    redirect("/dashboard");
  }

  const data = await db.query.testimonial.findMany({
    orderBy: [desc(testimonial.createdAt)],
  });

  return (
    <TestimonialsClient
      initialTestimonials={data}
      currentUser={session.user}
    />
  );
}
