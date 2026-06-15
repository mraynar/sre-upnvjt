import React from "react";
import { db } from "@/lib/db";
import { inventory } from "@/db/schema";
import { desc } from "drizzle-orm";
import InventoryClient from "./InventoryClient";

export const metadata = {
  title: "Inventaris | SRE Portal",
};

export default async function InventoryPage() {
  const items = await db.query.inventory.findMany({
    orderBy: [desc(inventory.createdAt)]
  });

  return (
    <InventoryClient initialItems={items} />
  );
}
