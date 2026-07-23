import React from "react";
import { notFound } from "next/navigation";
import { getDepartmentBySlug, getAllDepartments } from "@/lib/services/organizationService";
import DepartmentClient from "./DepartmentClient";

export async function generateStaticParams() {
  const departments = await getAllDepartments();
  return departments.map((d) => ({
    slug: d.slug,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const dept = await getDepartmentBySlug(resolvedParams.slug);
  
  if (!dept) {
    return {
      title: "Department Not Found | SRE UPNVJT",
    };
  }

  return {
    title: `${dept.name} | SRE UPNVJT`,
    description: dept.description || `Meet the members of the ${dept.name} department at SRE UPNVJT.`,
  };
}

export default async function DepartmentPage({ params }) {
  const resolvedParams = await params;
  const dept = await getDepartmentBySlug(resolvedParams.slug);

  if (!dept) {
    notFound();
  }

  return <DepartmentClient dept={dept} />;
}
