import React from "react";
import { db } from "@/lib/db";
import { partner } from "@/db/schema";
import { asc } from "drizzle-orm";
import PartnerClient from "./PartnerClient";

export const metadata = {
  title: "Our Partners | SRE Portal",
};

export default async function PartnersPage() {
  const partners = await db.query.partner.findMany({
    orderBy: [asc(partner.createdAt)]
  });

  return <PartnerClient initialPartners={partners} />;
}
