import React from "react";
import AboutClient from "./AboutClient";
import { db } from "@/lib/db";
import { user, department, role } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Us | SRE UPNVJT",
  description: "Meet the team and learn more about SRE UPNVJT.",
};

export default async function AboutPage() {
  // Fetch users with their department and role
  const usersWithRelations = await db.query.user.findMany({
    where: eq(user.isActive, true),
    with: {
      department: true,
      role: true,
    },
  });

  // Group users by department
  const groupedData = {};

  usersWithRelations.forEach((u) => {
    if (!u.department) return; // Skip users without department
    const deptName = u.department.name;
    if (!groupedData[deptName]) {
      groupedData[deptName] = [];
    }
    groupedData[deptName].push(u);
  });

  // Hierarchy mapping for roles (higher value = higher rank)
  const roleHierarchy = {
    "President": 100,
    "Vice President": 90,
    "Director": 80,
    "Manager": 70,
    "Staff": 10,
  };

  const getRoleWeight = (roleName) => {
    // If exact match
    if (roleHierarchy[roleName]) return roleHierarchy[roleName];
    // If contains keyword
    const lowerRole = roleName.toLowerCase();
    if (lowerRole.includes('president')) return 95;
    if (lowerRole.includes('director')) return 80;
    if (lowerRole.includes('manager') || lowerRole.includes('head')) return 70;
    if (lowerRole.includes('staff')) return 10;
    return 0;
  };

  // Predefined descriptions for departments
  const deptDescriptions = {
    "Executive Board": "Top leadership shaping the vision, strategy, and operational success of SRE UPNVJT.",
    "Human Resources": "Cultivating talent, fostering internal bonding, and ensuring a thriving community culture.",
    "Finance": "Strategizing fundraising, managing sponsorships, and maintaining financial stability.",
    "Media & Creative": "Membangun identitas visual, mengelola interaksi digital, dan menciptakan inovasi kreatif.",
    "ACE": "Meningkatkan wawasan akademik mahasiswa dan menjalankan kampanye kesadaran energi.",
    "Public Relations": "Focusing on external relations, strategic partnerships, and internal member development.",
  };

  // System/admin roles and departments to exclude from public display
  const SYSTEM_ROLES = ["super administrator", "system administrator", "super admin", "admin"];
  const SYSTEM_DEPTS = ["system administration", "system admin", "administration"];

  // Convert grouped data to the format expected by AboutClient
  const divisionsData = Object.keys(groupedData)
    .filter((deptName) => !SYSTEM_DEPTS.includes(deptName.toLowerCase()))
    .map((deptName) => {
    const members = groupedData[deptName]
      .filter((u) => {
        // Exclude system/admin roles
        const roleName = (u.role?.name || u.positionName || "").toLowerCase();
        return !SYSTEM_ROLES.some(r => roleName.includes(r));
      })
      .sort((a, b) => {
        const weightA = getRoleWeight(a.role?.name || a.positionName || '');
        const weightB = getRoleWeight(b.role?.name || b.positionName || '');
        if (weightA !== weightB) {
          return weightB - weightA; // Descending order
        }
        return a.name.localeCompare(b.name);
      })
      .map((u) => ({
        name: u.name,
        role: u.positionName || u.role?.name || "Staff",
        dept: deptName,
        profilePictureUrl: u.profilePictureUrl,
      }));

    return {
      id: deptName,
      title: deptName,
      desc: deptDescriptions[deptName] || "Driving innovation and operational success in SRE UPNVJT.",
      members: members,
    };
  }).filter((div) => div.members.length > 0); // Only include departments that have real members

  return <AboutClient divisionsData={divisionsData} />;
}
