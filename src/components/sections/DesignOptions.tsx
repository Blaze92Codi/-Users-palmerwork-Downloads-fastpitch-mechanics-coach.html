import { useStore } from "@/lib/store";
import type { OptionTier, Project } from "@/lib/types";
import { quoteRetailers } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import { Check, Clock, Layers, ShieldCheck, Star } from "lucide-react";

const TIER_META: Record<OptionTier, { badge: string; variant: "secondary" | "default" | "accent" }> = {
  good: { badge: "Budget", variant: "secondary" },
  better: { badge: "Best value", variant: "default" },
  best: { badge: "Premium", variant: "accent" },
};

export function DesignOptions({ project }: { project: Project }) {
  const { setTier } = useStore();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <CardTitle>Good · Better · Best</CardTitle>
        </div>
        <CardDescription>
          Three ways to build the same design. Pick a tier to drive the materials list, cut plan,
          pricing, and build steps.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5 lg:grid-cols-3">
          {project.options.map((opt) => {
            const selected = project.selectedTier === opt.tier;
            const best = quoteRetailers(opt.materials)[0];
            const meta = TIER_META[opt.tier];
            return (
              <div
                key={opt.tier}
                className={cn(
                  "flex flex-col rounded-xl border p-5 transition-all",
                  selected ? "border-primary ring-2 ring-primary/30 shadow-md" : "hover:border-primary/40"
                )}
              >
                <div className="flex items-center justify-between">
                  <Badge variant={meta.variant}>{meta.badge}</Badge>
                  {opt.tier === "best" && <Star className="h-4 w-4 text-accent" />}
                </div>
                <h3 className="mt-3 text-lg font-bold">{opt.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{opt.summary}</p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold tabular-nums">{formatCurrency(best.total)}</span>
                  <span className="text-xs text-muted-foreground">est. materials</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-success" /> {opt.durabilityYears} yr lifespan
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> ~{opt.estimatedHours} hr build
                  </span>
                </div>

                <ul className="mt-4 space-y-2 text-sm">
                  {opt.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex-1" />
                <Button
                  className="mt-2 w-full"
                  variant={selected ? "default" : "outline"}
                  onClick={() => setTier(project.id, opt.tier)}
                >
                  {selected ? (
                    <>
                      <Check className="h-4 w-4" /> Selected
                    </>
                  ) : (
                    "Choose this tier"
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
