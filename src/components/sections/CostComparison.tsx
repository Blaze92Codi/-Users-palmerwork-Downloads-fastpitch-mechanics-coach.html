import type { Project } from "@/lib/types";
import { quoteRetailers } from "@/lib/pricing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import { MapPin, Receipt, Tag } from "lucide-react";

const AVAILABILITY: Record<string, { label: string; variant: "success" | "warning" | "secondary" }> = {
  "in-stock": { label: "In stock", variant: "success" },
  limited: { label: "Limited", variant: "warning" },
  order: { label: "Order", variant: "secondary" },
};

export function CostComparison({ project }: { project: Project }) {
  const option = project.options.find((o) => o.tier === project.selectedTier)!;
  const quotes = quoteRetailers(option.materials);
  const cheapest = quotes[0]?.total ?? 0;
  const dearest = quotes[quotes.length - 1]?.total ?? 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" />
          <CardTitle>Cost Comparison</CardTitle>
          <Badge variant="secondary" className="ml-1 capitalize">{project.selectedTier} tier</Badge>
        </div>
        <CardDescription>
          Mock local retailer pricing for your materials list. You could save{" "}
          <span className="font-medium text-foreground">{formatCurrency(dearest - cheapest)}</span> by shopping around.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {quotes.map((q, i) => {
          const best = i === 0;
          const pct = dearest === 0 ? 0 : (q.total / dearest) * 100;
          const av = AVAILABILITY[q.availability];
          return (
            <div
              key={q.retailer}
              className={cn(
                "rounded-lg border p-4",
                best ? "border-success/50 bg-success/5" : ""
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{q.retailer}</span>
                  {best && (
                    <Badge variant="success" className="gap-1">
                      <Tag className="h-3 w-3" /> Best price
                    </Badge>
                  )}
                  <Badge variant={av.variant}>{av.label}</Badge>
                </div>
                <span className="text-lg font-extrabold tabular-nums">{formatCurrency(q.total)}</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full", best ? "bg-success" : "bg-primary/60")}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {q.distanceMi} mi away · {q.lineItems.length} line items
              </div>
            </div>
          );
        })}
        <p className="text-xs text-muted-foreground">
          Prices are simulated. Connect a retailer pricing API to pull live, location-aware quotes.
        </p>
      </CardContent>
    </Card>
  );
}
