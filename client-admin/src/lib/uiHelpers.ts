const AVATAR_COLORS = [
  "bg-orange-50 text-orange-600",
  "bg-blue-50 text-blue-600",
  "bg-teal-50 text-teal-600",
  "bg-pink-50 text-pink-600",
  "bg-green-50 text-green-600",
  "bg-amber-50 text-amber-600",
];

export function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export function avatarColorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function daysUntil(value: string): number {
  const diffMs = new Date(value).getTime() - Date.now();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}
