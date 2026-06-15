import { mysqlTable, serial, varchar, text, boolean, int, datetime, decimal, json, primaryKey } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// ENUMS are mapped to strings or standard varchars in Drizzle for MySQL, 
// or you can use mysqlEnum but for simplicity and safety across migrations, 
// using standard varchar with validation is often preferred. 
// We will use mysqlEnum for exact parity.
import { mysqlEnum } from 'drizzle-orm/mysql-core';

// Reusable enums are mapped inline to avoid column name conflicts in Drizzle
const APPROVAL_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'];
const TRANSACTION_TYPES = ['INCOME', 'EXPENSE'];
const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE', 'OVERDUE'];

// ==========================================
// 2. DYNAMIC RBAC & ORGANIZATION STRUCTURE
// ==========================================
export const department = mysqlTable('Department', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  code: varchar('code', { length: 255 }).unique().notNull(),
});

export const division = mysqlTable('Division', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  departmentId: int('departmentId').references(() => department.id).notNull(),
});

export const role = mysqlTable('Role', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  permissions: json('permissions').notNull(),
});

// ==========================================
// 3. USER & MANAJEMEN SDM
// ==========================================
export const user = mysqlTable('User', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  npm: varchar('npm', { length: 255 }).unique(),
  positionName: varchar('positionName', { length: 255 }),
  profilePictureUrl: varchar('profilePictureUrl', { length: 500 }),
  instagramUrl: varchar('instagramUrl', { length: 500 }),
  linkedinUrl: varchar('linkedinUrl', { length: 500 }),
  isActive: boolean('isActive').default(true).notNull(),
  roleId: int('roleId').references(() => role.id).notNull(),
  departmentId: int('departmentId').references(() => department.id),
  divisionId: int('divisionId').references(() => division.id),
  createdAt: datetime('createdAt').$defaultFn(() => new Date()).notNull(),
  updatedAt: datetime('updatedAt').$defaultFn(() => new Date()).notNull(),
});

// ==========================================
// 4. MANAJEMEN PROKER & KEPANITIAAN
// ==========================================
export const project = mysqlTable('Project', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  departmentId: int('departmentId').references(() => department.id).notNull(),
  startDate: datetime('startDate').notNull(),
  endDate: datetime('endDate'),
  status: mysqlEnum('status', APPROVAL_STATUSES).default('PENDING').notNull(),
  createdAt: datetime('createdAt').$defaultFn(() => new Date()).notNull(),
  updatedAt: datetime('updatedAt').$defaultFn(() => new Date()).notNull(),
});

export const committee = mysqlTable('Committee', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('userId').references(() => user.id).notNull(),
  projectId: int('projectId').references(() => project.id).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
});

// ==========================================
// 5. ABSENSI & KEHADIRAN
// ==========================================
export const attendanceSession = mysqlTable('AttendanceSession', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  date: datetime('date').$defaultFn(() => new Date()).notNull(),
  isActive: boolean('isActive').default(true).notNull(),
  createdById: int('createdById').references(() => user.id).notNull(),
  projectId: int('projectId').references(() => project.id),
});

export const attendance = mysqlTable('Attendance', {
  id: int('id').autoincrement().primaryKey(),
  sessionId: int('sessionId').references(() => attendanceSession.id).notNull(),
  userId: int('userId').references(() => user.id).notNull(),
  status: varchar('status', { length: 50 }).notNull(), // "HADIR", "IZIN", "SAKIT", "ALFA"
  proofUrl: varchar('proofUrl', { length: 1000 }),
  date: datetime('date').$defaultFn(() => new Date()).notNull(),
});

// ==========================================
// 6. MANAJEMEN KEUANGAN (CASHFLOW)
// ==========================================
export const finance = mysqlTable('Finance', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  type: mysqlEnum('type', TRANSACTION_TYPES).notNull(),
  proofUrl: varchar('proofUrl', { length: 1000 }),
  date: datetime('date').$defaultFn(() => new Date()).notNull(),
  loggedById: int('loggedById').references(() => user.id).notNull(),
  projectId: int('projectId').references(() => project.id),
});

// ==========================================
// 7. KONTEN & MEDIA (CMS UNTUK WEB PUBLIK)
// ==========================================
export const article = mysqlTable('Article', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  thumbnailUrl: varchar('thumbnailUrl', { length: 1000 }),
  isPublished: boolean('isPublished').default(false).notNull(),
  authorId: int('authorId').references(() => user.id).notNull(),
  createdAt: datetime('createdAt').$defaultFn(() => new Date()).notNull(),
  updatedAt: datetime('updatedAt').$defaultFn(() => new Date()).notNull(),
});

// ==========================================
// 8. INVENTARIS & PEMINJAMAN BARANG
// ==========================================
export const inventory = mysqlTable('Inventory', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 255 }),
  category: varchar('category', { length: 255 }).default('GENERAL').notNull(),
  quantity: int('quantity').default(1).notNull(),
  condition: varchar('condition', { length: 50 }).default('GOOD').notNull(),
  location: varchar('location', { length: 255 }),
  isAvailable: boolean('isAvailable').default(true).notNull(),
  createdAt: datetime('createdAt').$defaultFn(() => new Date()).notNull(),
  updatedAt: datetime('updatedAt').$defaultFn(() => new Date()).notNull(),
});

export const inventoryLoan = mysqlTable('InventoryLoan', {
  id: int('id').autoincrement().primaryKey(),
  itemId: int('itemId').references(() => inventory.id).notNull(),
  userId: int('userId').references(() => user.id).notNull(),
  quantity: int('quantity').notNull(),
  status: mysqlEnum('status', APPROVAL_STATUSES).default('PENDING').notNull(),
  borrowDate: datetime('borrowDate').$defaultFn(() => new Date()).notNull(),
  returnDate: datetime('returnDate'),
});

// ==========================================
// 9. BANK DATA (DOKUMEN TERPUSAT)
// ==========================================
export const document = mysqlTable('Document', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  url: varchar('url', { length: 1000 }).notNull(),
  type: varchar('type', { length: 50 }).default('OTHER').notNull(),
  description: text('description'),
  createdAt: datetime('createdAt').$defaultFn(() => new Date()).notNull(),
  updatedAt: datetime('updatedAt').$defaultFn(() => new Date()).notNull(),
});

// ==========================================
// 10. ACTIVITY (KEGIATAN/PROGRAM BESAR)
// ==========================================
export const activity = mysqlTable('Activity', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  imageUrl: varchar('imageUrl', { length: 1000 }),
  isPublished: boolean('isPublished').default(false).notNull(),
  createdAt: datetime('createdAt').$defaultFn(() => new Date()).notNull(),
  updatedAt: datetime('updatedAt').$defaultFn(() => new Date()).notNull(),
});

// ==========================================
// 11. MERCHANDISE (TOKO SRE)
// ==========================================
export const merchandise = mysqlTable('Merchandise', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  description: text('description').notNull(),
  imageUrl: varchar('imageUrl', { length: 1000 }),
  linkUrl: varchar('linkUrl', { length: 1000 }),
  isAvailable: boolean('isAvailable').default(true).notNull(),
  createdAt: datetime('createdAt').$defaultFn(() => new Date()).notNull(),
  updatedAt: datetime('updatedAt').$defaultFn(() => new Date()).notNull(),
});

// ==========================================
// 12. TODOLIST & TASK MANAGEMENT
// ==========================================
export const task = mysqlTable('Task', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  departmentId: int('departmentId').references(() => department.id).notNull(),
  assignedById: int('assignedById').references(() => user.id).notNull(),
  deadline: datetime('deadline').notNull(),
  status: mysqlEnum('status', TASK_STATUSES).default('TODO').notNull(),
  requireWeeklyReport: boolean('requireWeeklyReport').default(false).notNull(),
  finalResult: text('finalResult'),
  createdAt: datetime('createdAt').$defaultFn(() => new Date()).notNull(),
  updatedAt: datetime('updatedAt').$defaultFn(() => new Date()).notNull(),
});

export const taskReport = mysqlTable('TaskReport', {
  id: int('id').autoincrement().primaryKey(),
  taskId: int('taskId').references(() => task.id).notNull(),
  reportText: text('reportText').notNull(),
  createdAt: datetime('createdAt').$defaultFn(() => new Date()).notNull(),
});

// Prisma implicit m2m for Task <-> Role
export const _TaskRoles = mysqlTable('_TaskRoles', {
  A: int('A').references(() => role.id).notNull(), // Role id
  B: int('B').references(() => task.id).notNull(), // Task id
});

// ==========================================
// 13. NOTIFICATIONS
// ==========================================
export const notification = mysqlTable('Notification', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('userId').references(() => user.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  isRead: boolean('isRead').default(false).notNull(),
  linkUrl: varchar('linkUrl', { length: 1000 }),
  createdAt: datetime('createdAt').$defaultFn(() => new Date()).notNull(),
});

// ==========================================
// 14. PARTNERS (HOME PAGE)
// ==========================================
export const partner = mysqlTable('Partner', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  imageUrl: varchar('imageUrl', { length: 1000 }).notNull(),
  size: varchar('size', { length: 50 }).default('MEDIUM').notNull(),
  createdAt: datetime('createdAt').$defaultFn(() => new Date()).notNull(),
  updatedAt: datetime('updatedAt').$defaultFn(() => new Date()).notNull(),
});


// ==========================================
// RELATIONS
// ==========================================

export const departmentRelations = relations(department, ({ many }) => ({
  divisions: many(division),
  users: many(user),
  projects: many(project),
  tasks: many(task),
}));

export const divisionRelations = relations(division, ({ one, many }) => ({
  department: one(department, {
    fields: [division.departmentId],
    references: [department.id],
  }),
  users: many(user),
}));

export const roleRelations = relations(role, ({ many }) => ({
  users: many(user),
  tasks: many(_TaskRoles),
}));

export const userRelations = relations(user, ({ one, many }) => ({
  role: one(role, { fields: [user.roleId], references: [role.id] }),
  department: one(department, { fields: [user.departmentId], references: [department.id] }),
  division: one(division, { fields: [user.divisionId], references: [division.id] }),
  committees: many(committee),
  attendances: many(attendance),
  articles: many(article),
  finances: many(finance),
  loans: many(inventoryLoan),
  createdSessions: many(attendanceSession),
  createdTasks: many(task),
  notifications: many(notification),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
  department: one(department, { fields: [project.departmentId], references: [department.id] }),
  committees: many(committee),
  attendanceSessions: many(attendanceSession),
  finances: many(finance),
}));

export const committeeRelations = relations(committee, ({ one }) => ({
  user: one(user, { fields: [committee.userId], references: [user.id] }),
  project: one(project, { fields: [committee.projectId], references: [project.id] }),
}));

export const attendanceSessionRelations = relations(attendanceSession, ({ one, many }) => ({
  createdBy: one(user, { fields: [attendanceSession.createdById], references: [user.id] }),
  project: one(project, { fields: [attendanceSession.projectId], references: [project.id] }),
  attendances: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  session: one(attendanceSession, { fields: [attendance.sessionId], references: [attendanceSession.id] }),
  user: one(user, { fields: [attendance.userId], references: [user.id] }),
}));

export const financeRelations = relations(finance, ({ one }) => ({
  loggedBy: one(user, { fields: [finance.loggedById], references: [user.id] }),
  project: one(project, { fields: [finance.projectId], references: [project.id] }),
}));

export const articleRelations = relations(article, ({ one }) => ({
  author: one(user, { fields: [article.authorId], references: [user.id] }),
}));

export const inventoryRelations = relations(inventory, ({ many }) => ({
  loans: many(inventoryLoan),
}));

export const inventoryLoanRelations = relations(inventoryLoan, ({ one }) => ({
  item: one(inventory, { fields: [inventoryLoan.itemId], references: [inventory.id] }),
  user: one(user, { fields: [inventoryLoan.userId], references: [user.id] }),
}));

export const taskRelations = relations(task, ({ one, many }) => ({
  department: one(department, { fields: [task.departmentId], references: [department.id] }),
  assignedBy: one(user, { fields: [task.assignedById], references: [user.id] }),
  reports: many(taskReport),
  targetRoles: many(_TaskRoles),
}));

export const taskReportRelations = relations(taskReport, ({ one }) => ({
  task: one(task, { fields: [taskReport.taskId], references: [task.id] }),
}));

export const _TaskRolesRelations = relations(_TaskRoles, ({ one }) => ({
  role: one(role, { fields: [_TaskRoles.A], references: [role.id] }),
  task: one(task, { fields: [_TaskRoles.B], references: [task.id] }),
}));

export const notificationRelations = relations(notification, ({ one }) => ({
  user: one(user, { fields: [notification.userId], references: [user.id] }),
}));
