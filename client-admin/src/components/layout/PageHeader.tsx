import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string[];
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, breadcrumb, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold sm:text-2xl">{title}</h1>
          {breadcrumb && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              {breadcrumb.map((item, i) => (
                <span key={item} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight size={12} />}
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
        {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
