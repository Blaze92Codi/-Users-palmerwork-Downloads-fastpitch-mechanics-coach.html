import { Badge } from "@/components/ui/badge";
import type { ConfidenceLevel, MeasurementSource } from "@/lib/types";
import { CheckCircle2, CircleHelp, Pencil, Sparkles, TriangleAlert } from "lucide-react";

const CONFIG: Record<
  ConfidenceLevel,
  { label: string; variant: "success" | "warning" | "destructive" | "secondary" | "accent"; icon: typeof CheckCircle2 }
> = {
  high: { label: "High confidence", variant: "success", icon: CheckCircle2 },
  medium: { label: "Medium confidence", variant: "warning", icon: CircleHelp },
  low: { label: "Low — verify", variant: "destructive", icon: TriangleAlert },
  ai: { label: "AI estimate", variant: "accent", icon: Sparkles },
  manual: { label: "Manual entry", variant: "secondary", icon: Pencil },
};

export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const c = CONFIG[level];
  const Icon = c.icon;
  return (
    <Badge variant={c.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {c.label}
    </Badge>
  );
}

const SOURCE_LABEL: Record<MeasurementSource, string> = {
  manual: "Manual",
  lidar: "LiDAR scan",
  photo: "Photo AI",
  estimate: "Estimate",
};

export function SourceBadge({ source }: { source: MeasurementSource }) {
  return (
    <Badge variant="outline" className="gap-1 font-normal">
      {SOURCE_LABEL[source]}
    </Badge>
  );
}
