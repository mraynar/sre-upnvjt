import React from "react";
import prisma from "@/lib/prisma";
import MerchPublicClient from "./MerchPublicClient";

export const metadata = {
  title: "Merchandise | SRE UPNVJT",
  description: "Official merchandise SRE UPN Veteran Jawa Timur.",
};

export default async function MerchandisePage() {
  const dbMerchandise = await prisma.merchandise.findMany({
    orderBy: { createdAt: "desc" }
  });

  const safeMerch = dbMerchandise.map(m => ({
    ...m,
    price: m.price ? m.price.toString() : "0"
  }));

  return <MerchPublicClient merchandise={safeMerch} />;
}
