export type CalculatorMode = "products" | "bookings" | "services";
export type Currency = "NGN" | "USD";

export interface CalculatorInput {
  email: string;
  mode: CalculatorMode;
  currency: Currency;
  hoursPerWeek: number;
  inquiriesPerWeek: number;
  coldPercent: number;
  orderValue: number;
  hourlyValue: number;
}

export interface CalculatorSubmission extends CalculatorInput {
  id: string;
  monthlyTimeCost: number;
  monthlyRevenueLost: number;
  totalMonthlyCost: number;
  createdAt: string;
}
