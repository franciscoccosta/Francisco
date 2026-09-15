import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-charcoal/15 px-6 py-16 text-center">
      {icon && <div className="mb-4 text-ink-soft">{icon}</div>}
      <h3 className="font-display text-xl text-charcoal">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-ink-soft">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
