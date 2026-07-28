import { Hono } from "hono";
import { cors } from "hono/cors";
import type { AppEnv } from "./lib/hono-env.js";
import { onError, notFound } from "./middleware/error.js";
import { leadsRoutes } from "./modules/leads/leads.routes.js";
import { growthBlueprintRoutes } from "./modules/growth-blueprint/growth-blueprint.routes.js";
import { calculatorRoutes } from "./modules/calculator/calculator.routes.js";
import { softwareCostEstimatorRoutes } from "./modules/software-cost-estimator/software-cost-estimator.routes.js";
import { requirementsGeneratorRoutes } from "./modules/requirements-generator/requirements-generator.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { platformRoutes } from "./modules/platform/platform.routes.js";
import { ordersRoutes } from "./modules/orders/orders.routes.js";
import { productsRoutes } from "./modules/products/products.routes.js";
import { collectionsRoutes } from "./modules/collections/collections.routes.js";
import { customersRoutes } from "./modules/customers/customers.routes.js";
import { discountsRoutes } from "./modules/discounts/discounts.routes.js";
import { giftCardsRoutes } from "./modules/gift-cards/gift-cards.routes.js";
import { cartsRoutes } from "./modules/carts/carts.routes.js";
import { pagesRoutes } from "./modules/pages/pages.routes.js";
import { storeSectionsRoutes } from "./modules/store-sections/store-sections.routes.js";
import { seoRoutes } from "./modules/seo/seo.routes.js";
import { navigationRoutes } from "./modules/navigation/navigation.routes.js";
import { blogRoutes } from "./modules/blog/blog.routes.js";
import { storefrontRoutes } from "./modules/storefront/storefront.routes.js";
import { emailCampaignsRoutes } from "./modules/email-campaigns/email-campaigns.routes.js";
import { emailTemplatesRoutes } from "./modules/email-templates/email-templates.routes.js";
import { emailTrackingRoutes } from "./modules/email-tracking/email-tracking.routes.js";
import { industriesRoutes } from "./modules/industries/industries.routes.js";
import { articlesRoutes } from "./modules/articles/articles.routes.js";
import { caseStudiesRoutes } from "./modules/case-studies/case-studies.routes.js";
import { solutionsRoutes } from "./modules/solutions/solutions.routes.js";
import { clientsRoutes } from "./modules/clients/clients.routes.js";
import { projectsRoutes } from "./modules/projects/projects.routes.js";
import { invoicesRoutes } from "./modules/invoices/invoices.routes.js";
import { paymentsRoutes } from "./modules/payments/payments.routes.js";
import { maintenanceRoutes } from "./modules/maintenance/maintenance.routes.js";
import { messagesRoutes } from "./modules/messages/messages.routes.js";
import { ticketsRoutes } from "./modules/tickets/tickets.routes.js";
import { documentsRoutes } from "./modules/documents/documents.routes.js";
import { notificationsRoutes } from "./modules/notifications/notifications.routes.js";
import { usersRoutes } from "./modules/users/users.routes.js";
import { rolesRoutes } from "./modules/roles/roles.routes.js";
import { activityLogsRoutes } from "./modules/activity-logs/activity-logs.routes.js";
import { analyticsRoutes } from "./modules/analytics/analytics.routes.js";
import { settingsRoutes } from "./modules/settings/settings.routes.js";
import { integrationsRoutes } from "./modules/integrations/integrations.routes.js";
import { reportsRoutes } from "./modules/reports/reports.routes.js";
import { uploadsRoutes } from "./modules/uploads/uploads.routes.js";

export const app = new Hono<AppEnv>();

app.onError(onError);
app.notFound(notFound);

const ALLOWED_ORIGINS = new Set([
  "https://lurnics-client-staging.isegunamoo.workers.dev",
  "https://lurnics-production-client.isegunamoo.workers.dev",
  "https://lurnics-admin-staging.isegunamoo.workers.dev",
  "https://lurnics-production-admin.isegunamoo.workers.dev",
  "https://lurnics.com",
  "https://www.lurnics.com",
]);

app.use(
  "/api/*",
  cors({
    origin: (origin) => {
      if (!origin) return "";
      if (origin.startsWith("http://localhost:")) return origin;
      if (ALLOWED_ORIGINS.has(origin)) return origin;
      return "";
    },
    credentials: true,
  }),
);

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/api/leads", leadsRoutes);
app.route("/api/growth-blueprint", growthBlueprintRoutes);
app.route("/api/calculator", calculatorRoutes);
app.route("/api/software-cost-estimator", softwareCostEstimatorRoutes);
app.route("/api/requirements-generator", requirementsGeneratorRoutes);
app.route("/api/auth", authRoutes);
app.route("/api/platform/auth", platformRoutes);
app.route("/api/platform/orders", ordersRoutes);
app.route("/api/platform/products", productsRoutes);
app.route("/api/platform/collections", collectionsRoutes);
app.route("/api/platform/customers", customersRoutes);
app.route("/api/platform/discounts", discountsRoutes);
app.route("/api/platform/gift-cards", giftCardsRoutes);
app.route("/api/platform/carts", cartsRoutes);
app.route("/api/platform/pages", pagesRoutes);
app.route("/api/platform/store-sections", storeSectionsRoutes);
app.route("/api/platform/seo", seoRoutes);
app.route("/api/platform/navigation", navigationRoutes);
app.route("/api/platform/blog", blogRoutes);
app.route("/api/public/stores", storefrontRoutes);
app.route("/api/platform/email-campaigns", emailCampaignsRoutes);
app.route("/api/platform/email-templates", emailTemplatesRoutes);
app.route("/api/track", emailTrackingRoutes);
app.route("/api/industries", industriesRoutes);
app.route("/api/articles", articlesRoutes);
app.route("/api/case-studies", caseStudiesRoutes);
app.route("/api/solutions", solutionsRoutes);
app.route("/api/clients", clientsRoutes);
app.route("/api/projects", projectsRoutes);
app.route("/api/invoices", invoicesRoutes);
app.route("/api/payments", paymentsRoutes);
app.route("/api/maintenance", maintenanceRoutes);
app.route("/api/messages", messagesRoutes);
app.route("/api/tickets", ticketsRoutes);
app.route("/api/documents", documentsRoutes);
app.route("/api/notifications", notificationsRoutes);
app.route("/api/users", usersRoutes);
app.route("/api/roles", rolesRoutes);
app.route("/api/activity-logs", activityLogsRoutes);
app.route("/api/analytics", analyticsRoutes);
app.route("/api/settings", settingsRoutes);
app.route("/api/integrations", integrationsRoutes);
app.route("/api/reports", reportsRoutes);
app.route("/api/uploads", uploadsRoutes);
