import React from "react";
import { db } from "@/lib/db";
import { merchandise } from "@/db/schema";
import { desc } from "drizzle-orm";
import MerchClient from "./MerchClient";

export const metadata = {
  title: "Merchandise | SRE Portal",
};

export default async function MerchandisePage() {
  const dbMerchandise = await db.query.merchandise.findMany({
    orderBy: [desc(merchandise.createdAt)]
  });

  const safeMerch = dbMerchandise.map(m => ({
    ...m,
    price: m.price ? m.price.toString() : "0"
  }));

  return <MerchClient initialMerchandise={safeMerch} />;
}
