import { sql, relations } from "drizzle-orm";
import {
  text,
  integer,
  real,
  sqliteTable,
  uniqueIndex,
  index,
} from "drizzle-orm/sqlite-core";

// ============================================
// USERS
// ============================================
export const users = sqliteTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    phone: text("phone"),
    avatar: text("avatar"),
    isEmailVerified: integer("is_email_verified", { mode: "boolean" }).notNull().default(false),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    failedLoginAttempts: integer("failed_login_attempts").notNull().default(0),
    lockedUntil: text("locked_until"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at"),
    deletedAt: text("deleted_at"),
  },
  (table) => [
    // Partial unique index: a soft-deleted user's email can be reused by a new signup.
    uniqueIndex("users_email_idx").on(table.email).where(sql`deleted_at IS NULL`),
    index("users_created_at_idx").on(table.createdAt),
  ],
);

// ============================================
// ROLES
// ============================================
export const roles = sqliteTable(
  "roles",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull().unique(),
    description: text("description"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at"),
  },
  (table) => [uniqueIndex("roles_name_idx").on(table.name)],
);

// ============================================
// PERMISSIONS
// ============================================
export const permissions = sqliteTable(
  "permissions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull().unique(),
    description: text("description"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [uniqueIndex("permissions_name_idx").on(table.name)],
);

// ============================================
// ROLE_PERMISSIONS (join table)
// ============================================
export const rolePermissions = sqliteTable(
  "role_permissions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: text("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("role_permissions_role_id_permission_id_idx").on(
      table.roleId,
      table.permissionId,
    ),
    index("role_permissions_role_id_idx").on(table.roleId),
    index("role_permissions_permission_id_idx").on(table.permissionId),
  ],
);

// ============================================
// USER_ROLES (join table)
// ============================================
export const userRoles = sqliteTable(
  "user_roles",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("user_roles_user_id_role_id_idx").on(table.userId, table.roleId),
    index("user_roles_user_id_idx").on(table.userId),
    index("user_roles_role_id_idx").on(table.roleId),
  ],
);

// ============================================
// CLIENTS
// ============================================
export const clients = sqliteTable(
  "clients",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    companyName: text("company_name").notNull(),
    contactPerson: text("contact_person").notNull(),
    email: text("email"),
    phone: text("phone"),
    address: text("address"),
    industry: text("industry"),
    status: text("status").notNull().default("active"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at"),
    deletedAt: text("deleted_at"),
  },
  (table) => [
    index("clients_company_name_idx").on(table.companyName),
    // Partial unique index: a soft-deleted client's email can be reused.
    uniqueIndex("clients_email_idx").on(table.email).where(sql`deleted_at IS NULL`),
    index("clients_status_idx").on(table.status),
  ],
);

// ============================================
// PROJECTS
// ============================================
export const projects = sqliteTable(
  "projects",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "restrict" }),
    projectName: text("project_name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    projectType: text("project_type").notNull(),
    status: text("status").notNull(),
    progress: integer("progress").notNull().default(0),
    budget: real("budget"),
    startDate: text("start_date"),
    dueDate: text("due_date"),
    deploymentStatus: text("deployment_status").notNull().default("pending"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at"),
  },
  (table) => [
    index("projects_client_id_idx").on(table.clientId),
    uniqueIndex("projects_slug_idx").on(table.slug),
    index("projects_status_idx").on(table.status),
    index("projects_due_date_idx").on(table.dueDate),
  ],
);

// ============================================
// PROJECT_MEMBERS
// ============================================
export const projectMembers = sqliteTable(
  "project_members",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    assignedRole: text("assigned_role").notNull(),
    assignedAt: text("assigned_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("project_members_project_id_user_id_idx").on(table.projectId, table.userId),
  ],
);

// ============================================
// INVOICES
// ============================================
export const invoices = sqliteTable(
  "invoices",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    invoiceNumber: text("invoice_number").notNull().unique(),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "restrict" }),
    projectId: text("project_id").references(() => projects.id, { onDelete: "set null" }),
    amount: real("amount").notNull(),
    dueDate: text("due_date").notNull(),
    status: text("status").notNull(),
    notes: text("notes"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("invoices_invoice_number_idx").on(table.invoiceNumber),
    index("invoices_client_id_idx").on(table.clientId),
    index("invoices_project_id_idx").on(table.projectId),
    index("invoices_status_idx").on(table.status),
  ],
);

// ============================================
// PAYMENTS
// ============================================
export const payments = sqliteTable(
  "payments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    invoiceId: text("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "restrict" }),
    amount: real("amount").notNull(),
    paymentMethod: text("payment_method").notNull(),
    transactionReference: text("transaction_reference").unique(),
    paymentDate: text("payment_date").notNull(),
    status: text("status").notNull(),
  },
  (table) => [
    index("payments_invoice_id_idx").on(table.invoiceId),
    uniqueIndex("payments_transaction_reference_idx").on(table.transactionReference),
    index("payments_payment_date_idx").on(table.paymentDate),
  ],
);

// ============================================
// MAINTENANCE_CONTRACTS
// ============================================
export const maintenanceContracts = sqliteTable(
  "maintenance_contracts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "restrict" }),
    projectId: text("project_id").references(() => projects.id, { onDelete: "set null" }),
    planType: text("plan_type").notNull(),
    amount: real("amount").notNull(),
    startDate: text("start_date").notNull(),
    expiryDate: text("expiry_date").notNull(),
    status: text("status").notNull(),
    autoReminder: integer("auto_reminder", { mode: "boolean" }).notNull().default(true),
  },
  (table) => [
    index("maintenance_contracts_client_id_idx").on(table.clientId),
    index("maintenance_contracts_project_id_idx").on(table.projectId),
    index("maintenance_contracts_expiry_date_idx").on(table.expiryDate),
    index("maintenance_contracts_status_idx").on(table.status),
  ],
);

// ============================================
// MESSAGES
// ============================================
export const messages = sqliteTable(
  "messages",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    senderId: text("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    receiverId: text("receiver_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    message: text("message").notNull(),
    readStatus: integer("read_status", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("messages_sender_id_idx").on(table.senderId),
    index("messages_receiver_id_idx").on(table.receiverId),
    index("messages_created_at_idx").on(table.createdAt),
  ],
);

// ============================================
// SUPPORT_TICKETS
// ============================================
export const supportTickets = sqliteTable(
  "support_tickets",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "restrict" }),
    projectId: text("project_id").references(() => projects.id, { onDelete: "set null" }),
    subject: text("subject").notNull(),
    description: text("description").notNull(),
    priority: text("priority").notNull(),
    status: text("status").notNull(),
    assignedTo: text("assigned_to").references(() => users.id, { onDelete: "set null" }),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("support_tickets_client_id_idx").on(table.clientId),
    index("support_tickets_project_id_idx").on(table.projectId),
    index("support_tickets_status_idx").on(table.status),
    index("support_tickets_priority_idx").on(table.priority),
  ],
);

// ============================================
// NOTIFICATIONS
// ============================================
export const notifications = sqliteTable(
  "notifications",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    message: text("message").notNull(),
    notificationType: text("notification_type").notNull(),
    readStatus: integer("read_status", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("notifications_user_id_idx").on(table.userId),
    index("notifications_read_status_idx").on(table.readStatus),
    index("notifications_created_at_idx").on(table.createdAt),
  ],
);

// ============================================
// DOCUMENTS
// ============================================
export const documents = sqliteTable(
  "documents",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    clientId: text("client_id").references(() => clients.id, { onDelete: "set null" }),
    projectId: text("project_id").references(() => projects.id, { onDelete: "set null" }),
    documentName: text("document_name").notNull(),
    fileUrl: text("file_url").notNull(),
    fileType: text("file_type").notNull(),
    uploadedBy: text("uploaded_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    uploadedAt: text("uploaded_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("documents_client_id_idx").on(table.clientId),
    index("documents_project_id_idx").on(table.projectId),
    index("documents_file_type_idx").on(table.fileType),
  ],
);

// ============================================
// LEADS
// ============================================
export const leads = sqliteTable(
  "leads",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    companyName: text("company_name").notNull(),
    contactPerson: text("contact_person").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    budgetRange: text("budget_range"),
    source: text("source"),
    status: text("status").notNull().default("new"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("leads_email_idx").on(table.email),
    index("leads_status_idx").on(table.status),
    index("leads_created_at_idx").on(table.createdAt),
  ],
);

// ============================================
// INDUSTRIES
// ============================================
export const industries = sqliteTable(
  "industries",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
  },
  (table) => [uniqueIndex("industries_slug_idx").on(table.slug)],
);

// ============================================
// ARTICLES
// ============================================
export const articles = sqliteTable(
  "articles",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    featuredImage: text("featured_image"),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    metaKeywords: text("meta_keywords"),
    canonicalUrl: text("canonical_url"),
    ogImage: text("og_image"),
    status: text("status").notNull().default("draft"),
    authorId: text("author_id").references(() => users.id, { onDelete: "set null" }),
    publishedAt: text("published_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("articles_slug_idx").on(table.slug),
    index("articles_status_idx").on(table.status),
    index("articles_published_at_idx").on(table.publishedAt),
  ],
);

// ============================================
// CASE_STUDIES
// ============================================
export const caseStudies = sqliteTable(
  "case_studies",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    industryId: text("industry_id").references(() => industries.id, { onDelete: "set null" }),
    summary: text("summary"),
    content: text("content").notNull(),
    featuredImage: text("featured_image"),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    ogImage: text("og_image"),
    publishedAt: text("published_at"),
  },
  (table) => [
    uniqueIndex("case_studies_slug_idx").on(table.slug),
    index("case_studies_industry_id_idx").on(table.industryId),
    index("case_studies_published_at_idx").on(table.publishedAt),
  ],
);

// ============================================
// SOLUTIONS
// ============================================
export const solutions = sqliteTable(
  "solutions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
  },
  (table) => [uniqueIndex("solutions_slug_idx").on(table.slug)],
);

// ============================================
// ACTIVITY_LOGS
// ============================================
export const activityLogs = sqliteTable(
  "activity_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    ipAddress: text("ip_address"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("activity_logs_user_id_idx").on(table.userId),
    index("activity_logs_action_idx").on(table.action),
    index("activity_logs_created_at_idx").on(table.createdAt),
  ],
);

// ============================================
// RELATIONS
// ============================================

export const usersRelations = relations(users, ({ many }) => ({
  userRoles: many(userRoles),
  projectMemberships: many(projectMembers),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
  assignedTickets: many(supportTickets),
  notifications: many(notifications),
  uploadedDocuments: many(documents),
  articles: many(articles),
  activityLogs: many(activityLogs),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, { fields: [rolePermissions.roleId], references: [roles.id] }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, { fields: [userRoles.userId], references: [users.id] }),
  role: one(roles, { fields: [userRoles.roleId], references: [roles.id] }),
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  projects: many(projects),
  invoices: many(invoices),
  maintenanceContracts: many(maintenanceContracts),
  supportTickets: many(supportTickets),
  documents: many(documents),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(clients, { fields: [projects.clientId], references: [clients.id] }),
  members: many(projectMembers),
  invoices: many(invoices),
  maintenanceContracts: many(maintenanceContracts),
  supportTickets: many(supportTickets),
  documents: many(documents),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, { fields: [projectMembers.projectId], references: [projects.id] }),
  user: one(users, { fields: [projectMembers.userId], references: [users.id] }),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  client: one(clients, { fields: [invoices.clientId], references: [clients.id] }),
  project: one(projects, { fields: [invoices.projectId], references: [projects.id] }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  invoice: one(invoices, { fields: [payments.invoiceId], references: [invoices.id] }),
}));

export const maintenanceContractsRelations = relations(maintenanceContracts, ({ one }) => ({
  client: one(clients, { fields: [maintenanceContracts.clientId], references: [clients.id] }),
  project: one(projects, { fields: [maintenanceContracts.projectId], references: [projects.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sentMessages",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receivedMessages",
  }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one }) => ({
  client: one(clients, { fields: [supportTickets.clientId], references: [clients.id] }),
  project: one(projects, { fields: [supportTickets.projectId], references: [projects.id] }),
  assignee: one(users, { fields: [supportTickets.assignedTo], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  client: one(clients, { fields: [documents.clientId], references: [clients.id] }),
  project: one(projects, { fields: [documents.projectId], references: [projects.id] }),
  uploader: one(users, { fields: [documents.uploadedBy], references: [users.id] }),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
  author: one(users, { fields: [articles.authorId], references: [users.id] }),
}));

export const industriesRelations = relations(industries, ({ many }) => ({
  caseStudies: many(caseStudies),
}));

export const caseStudiesRelations = relations(caseStudies, ({ one }) => ({
  industry: one(industries, { fields: [caseStudies.industryId], references: [industries.id] }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, { fields: [activityLogs.userId], references: [users.id] }),
}));

// ============================================
// ROW TYPES
// ============================================

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;

export type RoleRow = typeof roles.$inferSelect;
export type NewRoleRow = typeof roles.$inferInsert;

export type PermissionRow = typeof permissions.$inferSelect;
export type NewPermissionRow = typeof permissions.$inferInsert;

export type RolePermissionRow = typeof rolePermissions.$inferSelect;
export type NewRolePermissionRow = typeof rolePermissions.$inferInsert;

export type UserRoleRow = typeof userRoles.$inferSelect;
export type NewUserRoleRow = typeof userRoles.$inferInsert;

export type ClientRow = typeof clients.$inferSelect;
export type NewClientRow = typeof clients.$inferInsert;

export type ProjectRow = typeof projects.$inferSelect;
export type NewProjectRow = typeof projects.$inferInsert;

export type ProjectMemberRow = typeof projectMembers.$inferSelect;
export type NewProjectMemberRow = typeof projectMembers.$inferInsert;

export type InvoiceRow = typeof invoices.$inferSelect;
export type NewInvoiceRow = typeof invoices.$inferInsert;

export type PaymentRow = typeof payments.$inferSelect;
export type NewPaymentRow = typeof payments.$inferInsert;

export type MaintenanceContractRow = typeof maintenanceContracts.$inferSelect;
export type NewMaintenanceContractRow = typeof maintenanceContracts.$inferInsert;

export type MessageRow = typeof messages.$inferSelect;
export type NewMessageRow = typeof messages.$inferInsert;

export type SupportTicketRow = typeof supportTickets.$inferSelect;
export type NewSupportTicketRow = typeof supportTickets.$inferInsert;

export type NotificationRow = typeof notifications.$inferSelect;
export type NewNotificationRow = typeof notifications.$inferInsert;

export type DocumentRow = typeof documents.$inferSelect;
export type NewDocumentRow = typeof documents.$inferInsert;

export type LeadRow = typeof leads.$inferSelect;
export type NewLeadRow = typeof leads.$inferInsert;

export type IndustryRow = typeof industries.$inferSelect;
export type NewIndustryRow = typeof industries.$inferInsert;

export type ArticleRow = typeof articles.$inferSelect;
export type NewArticleRow = typeof articles.$inferInsert;

export type CaseStudyRow = typeof caseStudies.$inferSelect;
export type NewCaseStudyRow = typeof caseStudies.$inferInsert;

export type SolutionRow = typeof solutions.$inferSelect;
export type NewSolutionRow = typeof solutions.$inferInsert;

export type ActivityLogRow = typeof activityLogs.$inferSelect;
export type NewActivityLogRow = typeof activityLogs.$inferInsert;
