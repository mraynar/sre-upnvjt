import { pgTable, serial, varchar, text, boolean, integer, timestamp, numeric, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==========================================
// 1. DYNAMIC RBAC & ORGANIZATION STRUCTURE
// ==========================================
export const department = pgTable('department', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  code: varchar('code', { length: 255 }).unique().notNull(),
});

export const division = pgTable('division', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  departmentId: integer('departmentId').references(() => department.id).notNull(),
});

export const role = pgTable('role', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  permissions: jsonb('permissions').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).$defaultFn(() => new Date()).notNull(),
});

// ==========================================
// 2. USER & MEMBER PROFILES
// ==========================================
export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  npm: varchar('npm', { length: 255 }).unique(),
  positionName: varchar('positionName', { length: 255 }),
  isActive: boolean('isActive').default(true).notNull(),
  roleId: integer('roleId').references(() => role.id).notNull(),
  departmentId: integer('departmentId').references(() => department.id),
  divisionId: integer('divisionId').references(() => division.id),
  profilePictureUrl: varchar('profilePictureUrl', { length: 500 }),
  totalPoints: integer('totalPoints').default(0).notNull(), // kept for legacy
  createdAt: timestamp('createdAt', { mode: 'date' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).$defaultFn(() => new Date()).notNull(),
});

export const memberProfile = pgTable('memberProfile', {
  userId: integer('userId').references(() => user.id).primaryKey(),
  xp: integer('xp').default(0).notNull(),
  level: integer('level').default(1).notNull(),
});

// ==========================================
// 3. ANNOUNCEMENTS
// ==========================================
export const announcement = pgTable('announcement', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  imageUrl: varchar('imageUrl', { length: 1000 }),
  actionLink: varchar('actionLink', { length: 1000 }),
  content: text('content').notNull(),
  targetAudience: varchar('targetAudience', { length: 255 }),
  isActive: boolean('isActive').default(true).notNull(),
  createdById: integer('createdById').references(() => user.id).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).$defaultFn(() => new Date()).notNull(),
});

// ==========================================
// 4. CONTENTS (Articles)
// ==========================================
export const content = pgTable('content', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  body: text('body').notNull(),
  imageUrl: varchar('imageUrl', { length: 1000 }),
  isPublished: boolean('isPublished').default(false).notNull(),
  updatedById: integer('updatedById').references(() => user.id).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).$defaultFn(() => new Date()).notNull(),
});

// ==========================================
// 5. TASKS & SUBMISSIONS
// ==========================================
export const formTemplate = pgTable('formTemplate', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  questions: jsonb('questions').notNull().default([]),
  createdById: integer('createdById').references(() => user.id).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).$defaultFn(() => new Date()).notNull(),
});

export const formSubmission = pgTable('formSubmission', {
  id: serial('id').primaryKey(),
  formTemplateId: integer('formTemplateId').references(() => formTemplate.id).notNull(),
  memberId: integer('memberId').references(() => user.id).notNull(),
  answers: jsonb('answers').notNull().default([]),
  score: integer('score'),
  submittedAt: timestamp('submittedAt', { mode: 'date' }).$defaultFn(() => new Date()).notNull(),
});

export const task = pgTable('task', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  rewardXp: integer('rewardXp').default(0).notNull(),
  formTemplateId: integer('formTemplateId').references(() => formTemplate.id),
  deadline: timestamp('deadline', { mode: 'date' }).notNull(),
  createdById: integer('createdById').references(() => user.id).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).$defaultFn(() => new Date()).notNull(),
});

export const taskSubmission = pgTable('taskSubmission', {
  id: serial('id').primaryKey(),
  taskId: integer('taskId').references(() => task.id).notNull(),
  memberId: integer('memberId').references(() => user.id).notNull(),
  fileUrl: varchar('fileUrl', { length: 1000 }),
  formSubmissionId: integer('formSubmissionId').references(() => formSubmission.id),
  status: varchar('status', { length: 50 }).notNull(), // 'PENDING', 'APPROVED', 'REJECTED'
  feedback: text('feedback'),
  reviewedById: integer('reviewedById').references(() => user.id),
  submittedAt: timestamp('submittedAt', { mode: 'date' }).$defaultFn(() => new Date()).notNull(),
});

// ==========================================
// 6. ATTENDANCES
// ==========================================
export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  memberId: integer('memberId').references(() => user.id).notNull(),
  date: timestamp('date', { mode: 'date' }).$defaultFn(() => new Date()).notNull(),
  status: varchar('status', { length: 50 }).notNull(), // 'PRESENT', 'ABSENT', etc.
  notes: text('notes'),
  createdAt: timestamp('createdAt', { mode: 'date' }).$defaultFn(() => new Date()).notNull(),
});

// ==========================================
// 7. EVENTS
// ==========================================
export const event = pgTable('event', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  bannerUrl: varchar('bannerUrl', { length: 1000 }),
  eventDate: timestamp('eventDate', { mode: 'date' }).notNull(),
  location: varchar('location', { length: 255 }),
  category: varchar('category', { length: 255 }),
  registrationType: varchar('registrationType', { length: 255 }),
  createdAt: timestamp('createdAt', { mode: 'date' }).$defaultFn(() => new Date()).notNull(),
});

// ==========================================
// 8. PARTNERS
// ==========================================
export const partner = pgTable('partner', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  logoUrl: varchar('logoUrl', { length: 1000 }),
  websiteUrl: varchar('websiteUrl', { length: 1000 }),
  tier: varchar('tier', { length: 50 }),
  isActive: boolean('isActive').default(true).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).$defaultFn(() => new Date()).notNull(),
});

// ==========================================
// 9. SYSTEM SETTINGS
// ==========================================
export const systemSetting = pgTable('systemSetting', {
  id: serial('id').primaryKey(),
  keyName: varchar('keyName', { length: 255 }).unique().notNull(),
  valueData: text('valueData').notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).$defaultFn(() => new Date()).notNull(),
});

// ==========================================
// 10. MERCHANDISE
// ==========================================
export const merchandise = pgTable('merchandise', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  description: text('description').notNull(),
  imageUrl: varchar('imageUrl', { length: 1000 }),
  linkUrl: varchar('linkUrl', { length: 1000 }),
  isAvailable: boolean('isAvailable').default(true).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).$defaultFn(() => new Date()).notNull(),
});


// RELATIONS
export const departmentRelations = relations(department, ({ many }) => ({
  divisions: many(division),
  users: many(user),
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
}));

export const userRelations = relations(user, ({ one, many }) => ({
  role: one(role, { fields: [user.roleId], references: [role.id] }),
  department: one(department, { fields: [user.departmentId], references: [department.id] }),
  division: one(division, { fields: [user.divisionId], references: [division.id] }),
  memberProfile: one(memberProfile, { fields: [user.id], references: [memberProfile.userId] }),
  announcementsCreated: many(announcement),
  contentsUpdated: many(content),
  tasksCreated: many(task),
  taskSubmissions: many(taskSubmission, { relationName: 'MemberSubmissions' }),
  tasksReviewed: many(taskSubmission, { relationName: 'ReviewerSubmissions' }),
  attendances: many(attendance),
}));

export const memberProfileRelations = relations(memberProfile, ({ one }) => ({
  user: one(user, { fields: [memberProfile.userId], references: [user.id] }),
}));

export const announcementRelations = relations(announcement, ({ one }) => ({
  createdBy: one(user, { fields: [announcement.createdById], references: [user.id] }),
}));

export const contentRelations = relations(content, ({ one }) => ({
  updatedBy: one(user, { fields: [content.updatedById], references: [user.id] }),
}));

export const formTemplateRelations = relations(formTemplate, ({ one, many }) => ({
  createdBy: one(user, { fields: [formTemplate.createdById], references: [user.id] }),
  submissions: many(formSubmission),
  tasks: many(task),
}));

export const formSubmissionRelations = relations(formSubmission, ({ one, many }) => ({
  formTemplate: one(formTemplate, { fields: [formSubmission.formTemplateId], references: [formTemplate.id] }),
  member: one(user, { fields: [formSubmission.memberId], references: [user.id] }),
  taskSubmissions: many(taskSubmission),
}));

export const taskRelations = relations(task, ({ one, many }) => ({
  createdBy: one(user, { fields: [task.createdById], references: [user.id] }),
  formTemplate: one(formTemplate, { fields: [task.formTemplateId], references: [formTemplate.id] }),
  submissions: many(taskSubmission),
}));

export const taskSubmissionRelations = relations(taskSubmission, ({ one }) => ({
  task: one(task, { fields: [taskSubmission.taskId], references: [task.id] }),
  member: one(user, { fields: [taskSubmission.memberId], references: [user.id], relationName: 'MemberSubmissions' }),
  reviewer: one(user, { fields: [taskSubmission.reviewedById], references: [user.id], relationName: 'ReviewerSubmissions' }),
  formSubmission: one(formSubmission, { fields: [taskSubmission.formSubmissionId], references: [formSubmission.id] }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  member: one(user, { fields: [attendance.memberId], references: [user.id] }),
}));

