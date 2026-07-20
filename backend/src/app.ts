import { Hono } from "hono";
import { cors } from "hono/cors";
import type { AppEnv } from "./lib/hono-env.js";
import { onError, notFound } from "./middleware/error.js";
import { leadsRoutes } from "./modules/leads/leads.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
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

app.use(
  "/api/*",
  cors({
    origin: (origin) => (origin?.startsWith("http://localhost:") ? origin : ""),
    credentials: true,
  }),
);

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/api/leads", leadsRoutes);
app.route("/api/auth", authRoutes);
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
