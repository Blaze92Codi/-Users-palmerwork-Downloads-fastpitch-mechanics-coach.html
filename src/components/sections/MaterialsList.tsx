import type { MaterialItem, Project } from "@/lib/types";
import { quoteRetailers } from "@/lib/pricing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Boxes, Hammer, PaintBucket, Scissors, Shovel, Sprout, Wrench } from "lucide-react";

const CATEGORY_ICON = {
  lumber: Scissors,
  hardware: Wrench,
  soil: Shovel,
  liner: Sprout,
  finish: PaintBucket,
  other: Boxes,
} as const;

const CATEGORY_LABEL = {
  lumber: "Lumber",
  hardware: "Hardware",
  soil: "Soil & Fill",
  liner: "Liner",
  finish: "Finish",
  other: "Other",
} as const;

export function MaterialsList({ project }: { project: Project }) {
  const option = project.options.find((o) => o.tier === project.selectedTier)!;
  const quote = quoteRetailers(option.materials)[0];
  const priceByName = new Map(quote.lineItems.map((li) => [li.name, li]));

  const grouped = option.materials.reduce<Record<string, MaterialItem[]>>((acc, m) => {
    (acc[m.category] ||= []).push(m);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Hammer className="h-5 w-5 text-primary" />
          <CardTitle>Materials List</CardTitle>
          <Badge variant="secondary" className="ml-1 capitalize">{project.selectedTier} tier</Badge>
        </div>
        <CardDescription>
          Everything you need for the <span className="font-medium">{option.title}</span> build, with
          best local pricing from {quote.retailer}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {Object.entries(grouped).map(([cat, items]) => {
          const Icon = CATEGORY_ICON[cat as keyof typeof CATEGORY_ICON];
          return (
            <div key={cat}>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Icon className="h-4 w-4" />
                {CATEGORY_LABEL[cat as keyof typeof CATEGORY_LABEL]}
              </div>
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <tbody className="divide-y">
                    {items.map((m) => {
                      const li = priceByName.get(m.name);
                      return (
                        <tr key={m.id} className="hover:bg-muted/30">
                          <td className="px-4 py-2.5">
                            <div className="font-medium">{m.name}</div>
                            <div className="text-xs text-muted-foreground">{m.spec}</div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">
                            {m.quantity} {m.unit}{m.quantity > 1 ? "s" : ""}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2.5 text-right tabular-nums">
                            {li ? formatCurrency(li.total) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        <div className="flex items-center justify-between rounded-lg bg-primary/5 px-4 py-3">
          <span className="font-semibold">Estimated materials total</span>
          <span className="text-xl font-extrabold tabular-nums">{formatCurrency(quote.total)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Pricing is mocked for the MVP. Live retailer pricing by ZIP code plugs in here.
        </p>
      </CardContent>
    </Card>
  );
}
