import { db } from "@/lib/db";
import { department, division, user, role } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function getAllDepartments() {
  const depts = await db.query.department.findMany({
    with: {
      divisions: true,
      users: {
        with: {
          role: true
        }
      }
    },
    orderBy: [asc(department.name)]
  });

  return depts.map(d => {
    // 1. Identify Director
    const directorUser = d.users?.find(u => {
      const rn = (u.positionName || u.role?.name || "").toLowerCase();
      return (rn.includes("director") || rn.includes("kadep") || rn.includes("head") || rn.includes("kepala")) && !rn.includes("manager");
    });

    const director = directorUser ? {
      name: directorUser.name,
      role: directorUser.positionName || directorUser.role?.name || "Director",
      photo: directorUser.image || null,
    } : null;

    // 2. Identify Managers and Staff per Division
    const mappedDivisions = (d.divisions || []).map(div => {
      const divUsers = d.users?.filter(u => u.divisionId === div.id) || [];
      
      const managerUser = divUsers.find(u => {
        const rn = (u.positionName || u.role?.name || "").toLowerCase();
        return rn.includes("manager") || rn.includes("wakil");
      });

      const manager = managerUser ? {
        name: managerUser.name,
        role: managerUser.positionName || managerUser.role?.name || "Manager",
        photo: managerUser.image || null,
      } : null;

      const staffUsers = divUsers.filter(u => u.id !== managerUser?.id && u.id !== directorUser?.id);
      
      const staff = staffUsers.map(u => ({
        name: u.name,
        role: u.positionName || u.role?.name || "Staff",
        photo: u.image || null,
      }));

      return {
        ...div,
        manager,
        staff,
      };
    });

    // Handle users assigned to the department but not to any specific division
    const unassignedUsers = d.users?.filter(u => !u.divisionId && u.id !== directorUser?.id) || [];
    if (unassignedUsers.length > 0) {
      const managerUser = unassignedUsers.find(u => {
        const rn = (u.positionName || u.role?.name || "").toLowerCase();
        return rn.includes("manager") || rn.includes("wakil");
      });

      const manager = managerUser ? {
        name: managerUser.name,
        role: managerUser.positionName || managerUser.role?.name || "Manager",
        photo: managerUser.image || null,
      } : null;

      const staffUsers = unassignedUsers.filter(u => u.id !== managerUser?.id);
      
      const staff = staffUsers.map(u => ({
        name: u.name,
        role: u.positionName || u.role?.name || "Staff",
        photo: u.image || null,
      }));

      mappedDivisions.push({
        id: "general",
        name: "General / Core Team",
        manager,
        staff,
      });
    }

    // 3. Overall Manager/Staff Counts
    const managerCount = mappedDivisions.filter(div => div.manager).length;
    const staffCount = mappedDivisions.reduce((acc, div) => acc + (div.staff ? div.staff.length : 0), 0);

    return {
      id: d.id,
      code: d.code,
      slug: d.code?.toLowerCase() || String(d.id),
      name: d.name,
      description: d.description || "",
      directorName: director ? director.name : "", // Kept for backwards compatibility
      directorPhoto: director ? director.photo : null,
      director: director,
      managerCount: managerCount,
      staffCount: staffCount,
      divisions: mappedDivisions,
      users: d.users || []
    };
  });
}

export async function getDepartmentBySlug(slug) {
  const depts = await getAllDepartments();
  return depts.find(d => d.slug === slug) || null;
}
