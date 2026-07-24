import React from "react";
import AboutClient from "./AboutClient";
import { getAllDepartments } from "@/lib/services/organizationService";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Us | SRE UPNVJT",
  description: "Learn more about SRE UPNVJT.",
};

export default async function AboutPage() {
  const departmentsData = await getAllDepartments();
  return <AboutClient departmentsData={departmentsData} />;
}

