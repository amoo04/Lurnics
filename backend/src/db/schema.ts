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
// PLATFORM (multi-tenant businesses that sign up to use LURNICS
// themselves - completely separate identity space from `users` below,
// which is LURNICS' own internal staff logging into client-admin. A
// platform JWT and an internal admin JWT are never interchangeable - see
// middleware/platform-auth.ts vs middleware/auth.ts.)
// ============================================
export const businesses = sqliteTable(
  "businesses",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    customDomain: text("custom_domain"),
    plan: text("plan").notNull().default("free"),
    status: text("status").notNull().default("active"),
    logo: text("logo"),
    currency: text("currency").notNull().default("USD"),
    timezone: text("timezone"),
    theme: text("theme").notNull().default("classic"), // classic | modern | minimal
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("businesses_slug_idx").on(table.slug),
    index("businesses_status_idx").on(table.status),
  ],
);

export const platformUsers = sqliteTable(
  "platform_users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    isEmailVerified: integer("is_email_verified", { mode: "boolean" }).notNull().default(false),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [uniqueIndex("platform_users_email_idx").on(table.email)],
);

// Membership: which platform user belongs to which business, and with
// what role (owner | admin | manager | staff | viewer). A user can belong
// to more than one business.
export const businessMembers = sqliteTable(
  "business_members",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => platformUsers.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("owner"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("business_members_business_user_idx").on(table.businessId, table.userId),
    index("business_members_user_id_idx").on(table.userId),
  ],
);

// Orders placed against a business's store. No checkout/cart system
// exists yet, so today these are entered manually by the business owner
// (e.g. phone/WhatsApp orders) - the schema is checkout-ready for later.
export const orders = sqliteTable(
  "orders",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    orderNumber: text("order_number").notNull(),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email"),
    channel: text("channel").notNull().default("Online Store"),
    paymentMethod: text("payment_method"),
    paymentStatus: text("payment_status").notNull().default("pending"),
    fulfillmentStatus: text("fulfillment_status").notNull().default("pending"),
    itemsCount: integer("items_count").notNull().default(1),
    totalAmount: real("total_amount").notNull(),
    currency: text("currency").notNull().default("USD"),
    notes: text("notes"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("orders_business_id_idx").on(table.businessId),
    index("orders_payment_status_idx").on(table.paymentStatus),
    index("orders_fulfillment_status_idx").on(table.fulfillmentStatus),
    index("orders_created_at_idx").on(table.createdAt),
  ],
);

// Products a business sells through its store. "Active"/"Draft" is the
// stored status; "Low Stock"/"Out of Stock" are derived from
// stockQuantity, not stored, so they never drift from the real count.
export const products = sqliteTable(
  "products",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    sku: text("sku"),
    description: text("description"),
    price: real("price").notNull(),
    stockQuantity: integer("stock_quantity").notNull().default(0),
    type: text("type").notNull().default("simple"),
    collections: text("collections"),
    imageUrl: text("image_url"),
    status: text("status").notNull().default("active"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("products_business_id_idx").on(table.businessId),
    index("products_status_idx").on(table.status),
    index("products_created_at_idx").on(table.createdAt),
  ],
);

// Collections group a business's products. Membership lives in
// product_collections (many-to-many) so "Products in Collection" counts
// are always a real join, never a stored/stale number.
export const collections = sqliteTable(
  "collections",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug"),
    description: text("description"),
    imageUrl: text("image_url"),
    status: text("status").notNull().default("active"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("collections_business_id_idx").on(table.businessId),
    index("collections_status_idx").on(table.status),
    uniqueIndex("collections_business_slug_idx").on(table.businessId, table.slug),
  ],
);

export const productCollections = sqliteTable(
  "product_collections",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    collectionId: text("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("product_collections_collection_product_idx").on(table.collectionId, table.productId),
    index("product_collections_product_id_idx").on(table.productId),
  ],
);

// A business's CRM customer records. Orders and total spend are never
// stored here - they're computed live by matching orders.customerEmail
// against customers.email, so they can't drift out of sync.
export const customers = sqliteTable(
  "customers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    status: text("status").notNull().default("active"),
    tags: text("tags"),
    notes: text("notes"),
    emailOptOut: integer("email_opt_out", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("customers_business_email_idx").on(table.businessId, table.email),
    index("customers_status_idx").on(table.status),
  ],
);

// Discounts. Status (active/scheduled/expired/disabled) is derived from
// isActive + startDate/endDate at read time, never stored, so it can't
// drift. usageCount only increments through a real redemption action -
// there's no checkout yet, so it honestly starts at 0.
export const discounts = sqliteTable(
  "discounts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    description: text("description"),
    type: text("type").notNull().default("code"), // code | automatic
    discountType: text("discount_type").notNull().default("percentage"), // percentage | fixed_amount | free_shipping
    value: real("value"),
    appliesTo: text("applies_to").notNull().default("entire_order"),
    minOrderAmount: real("min_order_amount"),
    usageLimit: integer("usage_limit"),
    usageCount: integer("usage_count").notNull().default(0),
    startDate: text("start_date").notNull(),
    endDate: text("end_date"),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("discounts_business_code_idx").on(table.businessId, table.code),
    index("discounts_type_idx").on(table.type),
  ],
);

// Gift cards. Balance is real money tracked on the card itself and only
// moves via a real redeem action; status (active/redeemed/expired/
// scheduled) is derived from balance + activatesAt/expiresAt, never
// stored.
export const giftCards = sqliteTable(
  "gift_cards",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    type: text("type").notNull().default("digital"), // digital | physical
    initialValue: real("initial_value").notNull(),
    balance: real("balance").notNull(),
    recipientName: text("recipient_name"),
    recipientEmail: text("recipient_email"),
    message: text("message"),
    activatesAt: text("activates_at"),
    expiresAt: text("expires_at"),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("gift_cards_business_code_idx").on(table.businessId, table.code),
  ],
);

// A business's own storefront pages. viewCount only increments on a real
// hit to the public page route (see modules/storefront) - it starts at 0
// and stays there until that route actually exists and gets traffic.
export const pages = sqliteTable(
  "pages",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    type: text("type").notNull().default("page"), // page | homepage | shop_page | collection_page
    content: text("content").notNull().default(""),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    status: text("status").notNull().default("draft"), // draft | published | archived
    viewCount: integer("view_count").notNull().default(0),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("pages_business_slug_idx").on(table.businessId, table.slug),
    index("pages_status_idx").on(table.status),
  ],
);

// The homepage builder. Exactly one row per (businessId, type) - seeded
// automatically at registerBusiness time (see modules/platform) rather
// than being freely creatable, so every business starts with the same 8
// sections and just edits content/visibility/order. The public storefront
// (modules/storefront) reads only visible=true rows, ordered by sortOrder.
export const storeSections = sqliteTable(
  "store_sections",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    visible: integer("visible", { mode: "boolean" }).notNull().default(true),
    content: text("content").notNull().default("{}"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("store_sections_business_type_idx").on(table.businessId, table.type),
    index("store_sections_business_id_idx").on(table.businessId),
  ],
);

// Navigation menu items. Grouped by `location` (main | footer | mobile)
// rather than a separate menu entity - one flat list per location, real
// order via sortOrder. The public storefront header renders these
// directly instead of the hardcoded Home/Shop links it started with.
export const navMenuItems = sqliteTable(
  "nav_menu_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    location: text("location").notNull().default("main"), // main | footer | mobile
    label: text("label").notNull(),
    linkType: text("link_type").notNull().default("custom"), // home | shop | collection | page | custom
    targetSlug: text("target_slug"), // collection slug or page slug, depending on linkType
    customUrl: text("custom_url"),
    sortOrder: integer("sort_order").notNull().default(0),
    isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("nav_menu_items_business_location_idx").on(table.businessId, table.location),
  ],
);

// A business's blog. Mirrors pages closely (slug uniqueness, draft/
// published, real viewCount incremented only by the public route).
export const blogPosts = sqliteTable(
  "blog_posts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull().default(""),
    coverImageUrl: text("cover_image_url"),
    status: text("status").notNull().default("draft"), // draft | published
    viewCount: integer("view_count").notNull().default(0),
    publishedAt: text("published_at"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("blog_posts_business_slug_idx").on(table.businessId, table.slug),
    index("blog_posts_status_idx").on(table.status),
  ],
);

// Carts. "Abandoned" is never stored - it's derived from lastActivityAt
// vs a threshold, and only for carts with no convertedOrderId. When a
// real order is placed for a matching customerEmail, orders.service links
// it back here (see placeOrder), which is what actually makes "recovery"
// real instead of guessed.
export const carts = sqliteTable(
  "carts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    customerName: text("customer_name"),
    customerEmail: text("customer_email").notNull(),
    convertedOrderId: text("converted_order_id"),
    convertedAt: text("converted_at"),
    lastActivityAt: text("last_activity_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("carts_business_id_idx").on(table.businessId),
    index("carts_customer_email_idx").on(table.customerEmail),
  ],
);

export const cartItems = sqliteTable(
  "cart_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    cartId: text("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    productId: text("product_id").references(() => products.id, { onDelete: "set null" }),
    productName: text("product_name").notNull(),
    quantity: integer("quantity").notNull().default(1),
    unitPrice: real("unit_price").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("cart_items_cart_id_idx").on(table.cartId)],
);

// Reusable email layouts a business can pick when composing a campaign.
// Seeded with real, functional HTML - no send/tracking data attached.
export const emailTemplates = sqliteTable(
  "email_templates",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    category: text("category").notNull().default("promotions"),
    description: text("description"),
    subject: text("subject").notNull(),
    html: text("html").notNull(),
    text: text("text").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("email_templates_category_idx").on(table.category)],
);

// Campaigns and per-recipient sends. Open/click are only ever set by a
// real hit on the tracking pixel / click-redirect endpoints (see
// modules/email-tracking) - nothing here is incremented synthetically.
export const emailCampaigns = sqliteTable(
  "email_campaigns",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    subject: text("subject").notNull(),
    html: text("html").notNull(),
    text: text("text").notNull(),
    ctaUrl: text("cta_url"),
    audience: text("audience").notNull().default("all_customers"),
    status: text("status").notNull().default("draft"),
    sentAt: text("sent_at"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("email_campaigns_business_id_idx").on(table.businessId)],
);

export const emailSends = sqliteTable(
  "email_sends",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    campaignId: text("campaign_id")
      .notNull()
      .references(() => emailCampaigns.id, { onDelete: "cascade" }),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    customerEmail: text("customer_email").notNull(),
    trackingToken: text("tracking_token").notNull(),
    sentAt: text("sent_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    openedAt: text("opened_at"),
    clickedAt: text("clicked_at"),
  },
  (table) => [
    uniqueIndex("email_sends_tracking_token_idx").on(table.trackingToken),
    index("email_sends_campaign_id_idx").on(table.campaignId),
  ],
);

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
    isEmailVerified: integer("is_email_verified", { mode: "boolean" })
      .notNull()
      .default(false),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    failedLoginAttempts: integer("failed_login_attempts").notNull().default(0),
    lockedUntil: text("locked_until"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at"),
    deletedAt: text("deleted_at"),
  },
  (table) => [
    // Partial unique index: a soft-deleted user's email can be reused by a new signup.
    uniqueIndex("users_email_idx")
      .on(table.email)
      .where(sql`deleted_at IS NULL`),
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
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
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
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
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
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
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
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("user_roles_user_id_role_id_idx").on(
      table.userId,
      table.roleId,
    ),
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
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at"),
    deletedAt: text("deleted_at"),
  },
  (table) => [
    index("clients_company_name_idx").on(table.companyName),
    // Partial unique index: a soft-deleted client's email can be reused.
    uniqueIndex("clients_email_idx")
      .on(table.email)
      .where(sql`deleted_at IS NULL`),
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
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
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
    assignedAt: text("assigned_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("project_members_project_id_user_id_idx").on(
      table.projectId,
      table.userId,
    ),
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
    projectId: text("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    amount: real("amount").notNull(),
    discount: real("discount").notNull().default(0),
    tax: real("tax").notNull().default(0),
    dueDate: text("due_date").notNull(),
    status: text("status").notNull(),
    notes: text("notes"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("invoices_invoice_number_idx").on(table.invoiceNumber),
    index("invoices_client_id_idx").on(table.clientId),
    index("invoices_project_id_idx").on(table.projectId),
    index("invoices_status_idx").on(table.status),
  ],
);

// ============================================
// INVOICE_LINE_ITEMS
// ============================================
export const invoiceLineItems = sqliteTable(
  "invoice_line_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    invoiceId: text("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }),
    description: text("description").notNull(),
    amount: real("amount").notNull(),
  },
  (table) => [index("invoice_line_items_invoice_id_idx").on(table.invoiceId)],
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
    uniqueIndex("payments_transaction_reference_idx").on(
      table.transactionReference,
    ),
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
    projectId: text("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    planType: text("plan_type").notNull(),
    amount: real("amount").notNull(),
    startDate: text("start_date").notNull(),
    expiryDate: text("expiry_date").notNull(),
    status: text("status").notNull(),
    autoReminder: integer("auto_reminder", { mode: "boolean" })
      .notNull()
      .default(true),
    lastReminderSentAt: text("last_reminder_sent_at"),
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
    receiverId: text("receiver_id").references(() => users.id, {
      onDelete: "restrict",
    }),
    clientId: text("client_id").references(() => clients.id, {
      onDelete: "set null",
    }),
    message: text("message").notNull(),
    readStatus: integer("read_status", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("messages_sender_id_idx").on(table.senderId),
    index("messages_receiver_id_idx").on(table.receiverId),
    index("messages_client_id_idx").on(table.clientId),
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
    projectId: text("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    subject: text("subject").notNull(),
    description: text("description").notNull(),
    priority: text("priority").notNull(),
    status: text("status").notNull(),
    assignedTo: text("assigned_to").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
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
    readStatus: integer("read_status", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
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
    clientId: text("client_id").references(() => clients.id, {
      onDelete: "set null",
    }),
    projectId: text("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    documentName: text("document_name").notNull(),
    fileUrl: text("file_url").notNull(),
    fileType: text("file_type").notNull(),
    uploadedBy: text("uploaded_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    uploadedAt: text("uploaded_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
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
    service: text("service"),
    status: text("status").notNull().default("new"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("leads_email_idx").on(table.email),
    index("leads_status_idx").on(table.status),
    index("leads_created_at_idx").on(table.createdAt),
  ],
);

// ============================================
// SOFTWARE COST ESTIMATOR SUBMISSIONS
// ============================================
// No price is ever computed or shown automatically - we don't have a
// published rate card, so a made-up number would be misleading. This tool
// captures structured project requirements and the team follows up with a
// real estimate.
export const softwareCostEstimatorSubmissions = sqliteTable(
  "software_cost_estimator_submissions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    leadId: text("lead_id").references(() => leads.id, { onDelete: "set null" }),
    companyName: text("company_name"),
    contactName: text("contact_name").notNull(),
    email: text("email").notNull(),
    projectType: text("project_type").notNull(),
    platforms: text("platforms").notNull(), // JSON string array
    features: text("features").notNull(), // JSON string array
    needsDesign: integer("needs_design", { mode: "boolean" }).notNull().default(false),
    timeline: text("timeline").notNull(),
    budgetRange: text("budget_range"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("software_cost_estimator_submissions_email_idx").on(table.email),
    index("software_cost_estimator_submissions_created_at_idx").on(table.createdAt),
  ],
);

// ============================================
// REQUIREMENTS GENERATOR SUBMISSIONS
// ============================================
// The "generated" requirements brief is assembled purely from the visitor's
// own answers (see modules/requirements-generator/requirements-generator.service.ts)
// - real, not AI-fabricated content.
export const requirementsGeneratorSubmissions = sqliteTable(
  "requirements_generator_submissions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    leadId: text("lead_id").references(() => leads.id, { onDelete: "set null" }),
    companyName: text("company_name"),
    contactName: text("contact_name").notNull(),
    email: text("email").notNull(),
    projectType: text("project_type").notNull(),
    goal: text("goal").notNull(),
    mustHaveFeatures: text("must_have_features").notNull(), // JSON string array
    niceToHaveFeatures: text("nice_to_have_features"), // JSON string array
    targetUsers: text("target_users"),
    timeline: text("timeline").notNull(),
    budgetRange: text("budget_range"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("requirements_generator_submissions_email_idx").on(table.email),
    index("requirements_generator_submissions_created_at_idx").on(table.createdAt),
  ],
);

// ============================================
// CALCULATOR SUBMISSIONS
// ============================================
// "What's manual work costing you" lead-magnet calculator. Totals are always
// computed server-side from the raw inputs (never trust a client-supplied
// total) - see modules/calculator/calculator.service.ts.
export const calculatorSubmissions = sqliteTable(
  "calculator_submissions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull(),
    mode: text("mode").notNull(), // products | bookings | services
    currency: text("currency").notNull(), // NGN | USD
    hoursPerWeek: real("hours_per_week").notNull(),
    inquiriesPerWeek: real("inquiries_per_week").notNull(),
    coldPercent: real("cold_percent").notNull(),
    orderValue: real("order_value").notNull(),
    hourlyValue: real("hourly_value").notNull(),
    monthlyTimeCost: real("monthly_time_cost").notNull(),
    monthlyRevenueLost: real("monthly_revenue_lost").notNull(),
    totalMonthlyCost: real("total_monthly_cost").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("calculator_submissions_email_idx").on(table.email),
    index("calculator_submissions_created_at_idx").on(table.createdAt),
  ],
);

// ============================================
// GROWTH BLUEPRINT SUBMISSIONS
// ============================================
// Captures the full Growth Blueprint questionnaire. `blueprint` and
// `generatedAt` stay null until the AI generation step is wired up (needs an
// Anthropic API key) - the submission itself, and the lead it creates, are
// real from day one.
export const growthBlueprintSubmissions = sqliteTable(
  "growth_blueprint_submissions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    leadId: text("lead_id").references(() => leads.id, { onDelete: "set null" }),
    companyName: text("company_name").notNull(),
    contactName: text("contact_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    website: text("website"),
    industry: text("industry").notNull(),
    country: text("country").notNull(),
    employees: text("employees").notNull(),
    revenueRange: text("revenue_range"),
    yearsInBusiness: text("years_in_business"),
    businessModel: text("business_model").notNull(),
    goals: text("goals").notNull(), // JSON string array
    currentChannels: text("current_channels"), // JSON string array
    monthlyBudget: text("monthly_budget"),
    hasWebsite: integer("has_website", { mode: "boolean" }).notNull().default(false),
    hasLandingPages: integer("has_landing_pages", { mode: "boolean" }).notNull().default(false),
    hasCrm: integer("has_crm", { mode: "boolean" }).notNull().default(false),
    hasEmailAutomation: integer("has_email_automation", { mode: "boolean" }).notNull().default(false),
    hasAnalytics: integer("has_analytics", { mode: "boolean" }).notNull().default(false),
    challenges: text("challenges").notNull(), // JSON string array
    status: text("status").notNull().default("pending"), // pending | generated | sent
    blueprint: text("blueprint"), // JSON blob, filled in once AI generation is wired up
    generatedAt: text("generated_at"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("growth_blueprint_submissions_email_idx").on(table.email),
    index("growth_blueprint_submissions_status_idx").on(table.status),
    index("growth_blueprint_submissions_created_at_idx").on(table.createdAt),
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
    authorId: text("author_id").references(() => users.id, {
      onDelete: "set null",
    }),
    publishedAt: text("published_at"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
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
    industryId: text("industry_id").references(() => industries.id, {
      onDelete: "set null",
    }),
    summary: text("summary"),
    content: text("content").notNull(),
    liveUrl: text("live_url"),
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
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    ipAddress: text("ip_address"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("activity_logs_user_id_idx").on(table.userId),
    index("activity_logs_action_idx").on(table.action),
    index("activity_logs_created_at_idx").on(table.createdAt),
  ],
);

// ============================================
// APP_SETTINGS
// ============================================
export const appSettings = sqliteTable("app_settings", {
  id: text("id").primaryKey().default("default"),
  data: text("data", { mode: "json" }).notNull().default("{}"),
  updatedAt: text("updated_at"),
});

// ============================================
// INTEGRATION_CONFIGS
// ============================================
export const integrationConfigs = sqliteTable(
  "integration_configs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    key: text("key").notNull().unique(),
    config: text("config", { mode: "json" }).notNull().default("{}"),
    connected: integer("connected", { mode: "boolean" })
      .notNull()
      .default(false),
    updatedAt: text("updated_at"),
  },
  (table) => [uniqueIndex("integration_configs_key_idx").on(table.key)],
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

export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  }),
);

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
  messages: many(messages),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(clients, {
    fields: [projects.clientId],
    references: [clients.id],
  }),
  members: many(projectMembers),
  invoices: many(invoices),
  maintenanceContracts: many(maintenanceContracts),
  supportTickets: many(supportTickets),
  documents: many(documents),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, { fields: [projectMembers.userId], references: [users.id] }),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  client: one(clients, {
    fields: [invoices.clientId],
    references: [clients.id],
  }),
  project: one(projects, {
    fields: [invoices.projectId],
    references: [projects.id],
  }),
  payments: many(payments),
  lineItems: many(invoiceLineItems),
}));

export const invoiceLineItemsRelations = relations(
  invoiceLineItems,
  ({ one }) => ({
    invoice: one(invoices, {
      fields: [invoiceLineItems.invoiceId],
      references: [invoices.id],
    }),
  }),
);

export const paymentsRelations = relations(payments, ({ one }) => ({
  invoice: one(invoices, {
    fields: [payments.invoiceId],
    references: [invoices.id],
  }),
}));

export const maintenanceContractsRelations = relations(
  maintenanceContracts,
  ({ one }) => ({
    client: one(clients, {
      fields: [maintenanceContracts.clientId],
      references: [clients.id],
    }),
    project: one(projects, {
      fields: [maintenanceContracts.projectId],
      references: [projects.id],
    }),
  }),
);

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
  client: one(clients, {
    fields: [messages.clientId],
    references: [clients.id],
  }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one }) => ({
  client: one(clients, {
    fields: [supportTickets.clientId],
    references: [clients.id],
  }),
  project: one(projects, {
    fields: [supportTickets.projectId],
    references: [projects.id],
  }),
  assignee: one(users, {
    fields: [supportTickets.assignedTo],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  client: one(clients, {
    fields: [documents.clientId],
    references: [clients.id],
  }),
  project: one(projects, {
    fields: [documents.projectId],
    references: [projects.id],
  }),
  uploader: one(users, {
    fields: [documents.uploadedBy],
    references: [users.id],
  }),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
  author: one(users, { fields: [articles.authorId], references: [users.id] }),
}));

export const industriesRelations = relations(industries, ({ many }) => ({
  caseStudies: many(caseStudies),
}));

export const caseStudiesRelations = relations(caseStudies, ({ one }) => ({
  industry: one(industries, {
    fields: [caseStudies.industryId],
    references: [industries.id],
  }),
}));

export const businessMembersRelations = relations(businessMembers, ({ one }) => ({
  business: one(businesses, {
    fields: [businessMembers.businessId],
    references: [businesses.id],
  }),
  user: one(platformUsers, {
    fields: [businessMembers.userId],
    references: [platformUsers.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, { fields: [activityLogs.userId], references: [users.id] }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  business: one(businesses, { fields: [orders.businessId], references: [businesses.id] }),
}));

export const productsRelations = relations(products, ({ one }) => ({
  business: one(businesses, { fields: [products.businessId], references: [businesses.id] }),
}));

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  business: one(businesses, { fields: [collections.businessId], references: [businesses.id] }),
  productCollections: many(productCollections),
}));

export const productCollectionsRelations = relations(productCollections, ({ one }) => ({
  collection: one(collections, {
    fields: [productCollections.collectionId],
    references: [collections.id],
  }),
  product: one(products, { fields: [productCollections.productId], references: [products.id] }),
}));

export const customersRelations = relations(customers, ({ one }) => ({
  business: one(businesses, { fields: [customers.businessId], references: [businesses.id] }),
}));

export const discountsRelations = relations(discounts, ({ one }) => ({
  business: one(businesses, { fields: [discounts.businessId], references: [businesses.id] }),
}));

export const giftCardsRelations = relations(giftCards, ({ one }) => ({
  business: one(businesses, { fields: [giftCards.businessId], references: [businesses.id] }),
}));

export const pagesRelations = relations(pages, ({ one }) => ({
  business: one(businesses, { fields: [pages.businessId], references: [businesses.id] }),
}));

export const navMenuItemsRelations = relations(navMenuItems, ({ one }) => ({
  business: one(businesses, { fields: [navMenuItems.businessId], references: [businesses.id] }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  business: one(businesses, { fields: [blogPosts.businessId], references: [businesses.id] }),
}));

export const storeSectionsRelations = relations(storeSections, ({ one }) => ({
  business: one(businesses, { fields: [storeSections.businessId], references: [businesses.id] }),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  business: one(businesses, { fields: [carts.businessId], references: [businesses.id] }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  product: one(products, { fields: [cartItems.productId], references: [products.id] }),
}));

export const emailCampaignsRelations = relations(emailCampaigns, ({ one, many }) => ({
  business: one(businesses, { fields: [emailCampaigns.businessId], references: [businesses.id] }),
  sends: many(emailSends),
}));

export const emailSendsRelations = relations(emailSends, ({ one }) => ({
  campaign: one(emailCampaigns, { fields: [emailSends.campaignId], references: [emailCampaigns.id] }),
}));

// ============================================
// ROW TYPES
// ============================================

export type UserRow = typeof users.$inferSelect;
export type NewBusinessRow = typeof businesses.$inferInsert;
export type NewPlatformUserRow = typeof platformUsers.$inferInsert;
export type NewBusinessMemberRow = typeof businessMembers.$inferInsert;
export type NewOrderRow = typeof orders.$inferInsert;
export type NewProductRow = typeof products.$inferInsert;
export type NewCollectionRow = typeof collections.$inferInsert;
export type NewProductCollectionRow = typeof productCollections.$inferInsert;
export type NewCustomerRow = typeof customers.$inferInsert;
export type NewDiscountRow = typeof discounts.$inferInsert;
export type NewGiftCardRow = typeof giftCards.$inferInsert;
export type NewPageRow = typeof pages.$inferInsert;
export type NewNavMenuItemRow = typeof navMenuItems.$inferInsert;
export type NewBlogPostRow = typeof blogPosts.$inferInsert;
export type NewStoreSectionRow = typeof storeSections.$inferInsert;
export type NewCartRow = typeof carts.$inferInsert;
export type NewCartItemRow = typeof cartItems.$inferInsert;
export type NewEmailTemplateRow = typeof emailTemplates.$inferInsert;
export type NewEmailCampaignRow = typeof emailCampaigns.$inferInsert;
export type NewEmailSendRow = typeof emailSends.$inferInsert;
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

export type InvoiceLineItemRow = typeof invoiceLineItems.$inferSelect;
export type NewInvoiceLineItemRow = typeof invoiceLineItems.$inferInsert;

export type PaymentRow = typeof payments.$inferSelect;
export type NewPaymentRow = typeof payments.$inferInsert;

export type MaintenanceContractRow = typeof maintenanceContracts.$inferSelect;
export type NewMaintenanceContractRow =
  typeof maintenanceContracts.$inferInsert;

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
export type NewGrowthBlueprintSubmissionRow = typeof growthBlueprintSubmissions.$inferInsert;
export type NewCalculatorSubmissionRow = typeof calculatorSubmissions.$inferInsert;
export type NewSoftwareCostEstimatorSubmissionRow = typeof softwareCostEstimatorSubmissions.$inferInsert;
export type NewRequirementsGeneratorSubmissionRow = typeof requirementsGeneratorSubmissions.$inferInsert;

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

export type AppSettingsRow = typeof appSettings.$inferSelect;
export type NewAppSettingsRow = typeof appSettings.$inferInsert;

export type IntegrationConfigRow = typeof integrationConfigs.$inferSelect;
export type NewIntegrationConfigRow = typeof integrationConfigs.$inferInsert;
