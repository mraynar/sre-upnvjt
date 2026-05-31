import React from "react";
import prisma from "@/lib/prisma";
import InventoryClient from "./InventoryClient";

export const metadata = {
  title: "Inventaris | SRE Portal",
};

export default async function InventoryPage() {
  const items = await prisma.inventory.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <InventoryClient initialItems={items} />
  );
}
