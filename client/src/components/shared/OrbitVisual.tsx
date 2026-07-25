import type { LucideIcon } from "lucide-react";

export interface OrbitNode {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

interface OrbitVisualProps {
  centerIcon: LucideIcon;
  nodes: OrbitNode[];
  size?: number;
}

export default function OrbitVisual({ centerIcon: CenterIcon, nodes, size = 440 }: OrbitVisualProps) {
  const center = size / 2;
  const ringR = size * 0.3636;
  const badgeR = size * 0.4;
  const outerRingSize = size * 0.727;
  const innerRingSize = size * 0.6136;

  function pointAt(radius: number, angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: center + radius * Math.sin(rad), y: center - radius * Math.cos(rad) };
  }

  const step = 360 / nodes.length;

  return (
    <div className="relative hidden shrink-0 md:block" style={{ height: size, width: size }}>
      <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_center,_rgba(249,115,22,0.12),_transparent_65%)] blur-2xl" />

      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-200"
        style={{ height: outerRingSize, width: outerRingSize }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-300 shadow-[0_0_60px_rgba(249,115,22,0.15)]"
        style={{ height: innerRingSize, width: innerRingSize }}
      />

      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="orbitLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(249,115,22,0.6)" />
            <stop offset="100%" stopColor="rgba(249,115,22,0.1)" />
          </linearGradient>
        </defs>
        {nodes.map(({ title }, i) => {
          const angle = i * step;
          const ring = pointAt(ringR, angle);
          const badge = pointAt(badgeR, angle);
          return (
            <g key={title}>
              <line x1={ring.x} y1={ring.y} x2={badge.x} y2={badge.y} stroke="url(#orbitLine)" strokeWidth={1.5} />
              <circle cx={ring.x} cy={ring.y} r={4} fill="#f97316" />
            </g>
          );
        })}
      </svg>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex h-28 w-28 rotate-45 items-center justify-center rounded-2xl border border-gray-900 bg-gray-900 shadow-[0_20px_40px_rgba(17,24,39,0.25)]">
          <CenterIcon size={40} className="-rotate-45 text-white" strokeWidth={1.75} />
        </div>
        <div className="absolute inset-0 -z-10 translate-y-6 rounded-2xl border border-gray-200 bg-white" />
        <div className="absolute inset-0 -z-20 translate-y-12 rounded-2xl border border-gray-200 bg-white" />
      </div>

      {nodes.map(({ icon: Icon, title, subtitle }, i) => {
        const angle = i * step;
        const badge = pointAt(badgeR, angle);
        return (
          <div
            key={title}
            style={{ left: badge.x, top: badge.y, animationDelay: `${i * 0.8}s` }}
            className="animate-float absolute flex w-max -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs shadow-sm"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-orange-50 text-orange-500">
              <Icon size={13} />
            </span>
            <span>
              <span className="block font-medium text-gray-900">{title}</span>
              <span className="block text-[10px] text-gray-500">{subtitle}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
