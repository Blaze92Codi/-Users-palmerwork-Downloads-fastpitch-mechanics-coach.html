import type { Project, SafetySeverity } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { HardHat, Info, OctagonAlert, ShieldAlert, TriangleAlert } from "lucide-react";

const SEVERITY: Record<
  SafetySeverity,
  { label: string; icon: typeof Info; box: string; iconColor: string; variant: "secondary" | "warning" | "destructive" }
> = {
  info: { label: "Info", icon: Info, box: "border-border bg-muted/40", iconColor: "text-muted-foreground", variant: "secondary" },
  caution: { label: "Caution", icon: TriangleAlert, box: "border-warning/40 bg-warning/10", iconColor: "text-warning", variant: "warning" },
  warning: { label: "Warning", icon: ShieldAlert, box: "border-warning/50 bg-warning/10", iconColor: "text-warning", variant: "warning" },
  danger: { label: "Danger", icon: OctagonAlert, box: "border-destructive/50 bg-destructive/10", iconColor: "text-destructive", variant: "destructive" },
};

export function SafetyWarnings({ project }: { project: Project }) {
  const sorted = [...project.safety].sort((a, b) => {
    const rank: Record<SafetySeverity, number> = { danger: 0, warning: 1, caution: 2, info: 3 };
    return rank[a.severity] - rank[b.severity];
  });

  return (
    <Card className="border-warning/40">
      <CardHeader>
        <div className="flex items-center gap-2">
          <HardHat className="h-5 w-5 text-warning" />
          <CardTitle>Safety Warning System</CardTitle>
        </div>
        <CardDescription>
          Read before you build. Warnings are ranked by severity and surfaced inside each build step.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {sorted.map((s) => {
          const cfg = SEVERITY[s.severity];
          const Icon = cfg.icon;
          return (
            <div key={s.id} className={cn("rounded-lg border p-4", cfg.box)}>
              <div className="flex items-start gap-3">
                <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", cfg.iconColor)} />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold">{s.title}</h4>
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{s.detail}</p>
                  {s.ppe && s.ppe.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {s.ppe.map((p) => (
                        <Badge key={p} variant="outline" className="gap-1 font-normal">
                          <HardHat className="h-3 w-3" /> {p}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
