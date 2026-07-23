const MOCK_DEPARTMENTS = [
  {
    slug: "academic-campaign-education",
    name: "Academic Campaign & Education (ACE)",
    description: "Meningkatkan wawasan akademik mahasiswa dan menjalankan kampanye kesadaran energi.",
    director: null,
    divisions: []
  },
  {
    slug: "human-resource",
    name: "Human Resource Department",
    description: "Cultivating talent, fostering internal bonding, and ensuring a thriving community culture.",
    director: null,
    divisions: []
  },
  {
    slug: "finance",
    name: "Finance Department",
    description: "Strategizing fundraising, managing sponsorships, and maintaining financial stability.",
    director: null,
    divisions: []
  },
  {
    slug: "media-creative",
    name: "Media & Creative Department",
    description: "Membangun identitas visual, mengelola interaksi digital, dan menciptakan inovasi kreatif.",
    director: null,
    divisions: []
  },
  {
    slug: "public-relations",
    name: "Public Relations Department",
    description: "Focusing on external relations, strategic partnerships, and internal member development.",
    director: null,
    divisions: []
  }
];

export async function getAllDepartments() {
  // Simulates an API/database delay and maps properties
  return MOCK_DEPARTMENTS.map(d => ({
    slug: d.slug,
    name: d.name,
    description: d.description,
    directorName: d.director ? d.director.name : "",
    directorPhoto: d.director ? d.director.photo : null,
    managerCount: d.divisions ? d.divisions.length : 0,
    staffCount: d.divisions ? d.divisions.reduce((acc, div) => acc + (div.staff ? div.staff.length : 0), 0) : 0,
  }));
}

export async function getDepartmentBySlug(slug) {
  const dept = MOCK_DEPARTMENTS.find(d => d.slug === slug);
  if (!dept) return null;
  return dept;
}
