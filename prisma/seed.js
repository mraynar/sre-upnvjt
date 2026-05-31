const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({});

async function main() {
  console.log('Seeding initial RBAC data...');

  // 1. Create Default Department
  const bphDept = await prisma.department.upsert({
    where: { code: 'BPH' },
    update: {},
    create: {
      name: 'Badan Pengurus Harian',
      code: 'BPH',
    },
  });

  // 2. Create Default Division
  let defaultDiv = await prisma.division.findFirst({
    where: { name: 'Presidency', departmentId: bphDept.id },
  });
  if (!defaultDiv) {
    defaultDiv = await prisma.division.create({
      data: {
        name: 'Presidency',
        departmentId: bphDept.id,
      },
    });
  }

  // 3. Create Default Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: {
      name: 'SUPER_ADMIN',
      permissions: {
        all: ["create", "read", "update", "delete"]
      },
    },
  });

  await prisma.role.upsert({
    where: { name: 'STAFF' },
    update: {},
    create: {
      name: 'STAFF',
      permissions: {
        tasks: ["read", "update"],
        attendance: ["read", "create"]
      },
    },
  });

  // 4. Create SUPER_ADMIN User
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@sre.co.id' },
  });

  if (existingAdmin) {
    console.log('SUPER_ADMIN already exists. Skipping...');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@sre.co.id',
      password: hashedPassword,
      npm: '00000000000',
      roleId: superAdminRole.id,
      departmentId: bphDept.id,
      divisionId: defaultDiv.id,
      positionName: 'President',
    },
  });

  console.log('Successfully seeded database with RBAC models!');
  console.log('SUPER_ADMIN Email: admin@sre.co.id');
  console.log('SUPER_ADMIN Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
