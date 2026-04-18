import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
}

export function StatCard({ label, value, icon: Icon, hint }: Props) {
  return (
    <Card className="rounded-2xl border-border/60 bg-card-luxe p-6 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-4xl text-gradient">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className="rounded-full bg-gold/15 p-3">
          <Icon className="h-5 w-5 text-gold" />
        </div>
      </div>
    </Card>
  );
}
