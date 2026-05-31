import React from "react";
import prisma from "@/lib/prisma";
import MerchClient from "./MerchClient";

export const metadata = {
  title: "Merchandise | SRE Portal",
};

export default async function MerchandisePage() {
  const merchandise = await prisma.merchandise.findMany({
    orderBy: { createdAt: "desc" }
  });

  const safeMerch = merchandise.map(m => ({
    ...m,
    price: m.price ? m.price.toString() : "0"
  }));

  return <MerchClient initialMerchandise={safeMerch} />;
}
