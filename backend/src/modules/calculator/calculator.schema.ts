import { z } from "zod";

export const createCalculatorSubmissionSchema = z.object({
  email: z.string().email(),
  mode: z.enum(["products", "bookings", "services"]),
  currency: z.enum(["NGN", "USD"]),
  hoursPerWeek: z.number().min(0).max(80),
  inquiriesPerWeek: z.number().min(0).max(500),
  coldPercent: z.number().min(0).max(100),
  orderValue: z.number().min(0),
  hourlyValue: z.number().min(0),
});

export const listCalculatorSubmissionsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type CreateCalculatorSubmissionInput = z.infer<typeof createCalculatorSubmissionSchema>;
