const AVATAR_COLORS = [
  "bg-indigo-500/20 text-indigo-300",
  "bg-purple-500/20 text-purple-300",
  "bg-blue-500/20 text-blue-300",
  "bg-teal-500/20 text-teal-300",
  "bg-pink-500/20 text-pink-300",
  "bg-green-500/20 text-green-300",
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
