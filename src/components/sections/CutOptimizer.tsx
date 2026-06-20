import { useMemo, useState } from "react";
import type { Project } from "@/lib/types";
import { deriveCuts } from "@/lib/deriveCuts";
import { naiveBoardCount, optimizeCuts } from "@/lib/cutOptimizer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatInches } from "@/lib/utils";
import { Scissors, Sparkles, TrendingDown } from "lucide-react";

const KERF_PRESETS = [
  { label: 'Fine (1/16")', value: 0.0625 },
  { label: 'Standard (1/8")', value: 0.125 },
  { label: 'Wide (3/16")', value: 0.1875 },
];

export function CutOptimizer({ project }: { project: Project }) {
  const [kerf, setKerf] = useState(project.cutKerf);
  const { requirements, stockLength } = useMemo(() => deriveCuts(project), [project]);

  // Wall boards and posts can have different stock lengths; optimize the wall
  // pieces (the bulk of the lumber) against the dominant stock length.
  const wallReqs = requirements.filter((r) => r.stockLength === stockLength);
  const plan = useMemo(
    () => optimizeCuts({ requirements: wallReqs, stockLength, kerf }),
    [wallReqs, stockLength, kerf]
  );

  const naive = naiveBoardCount(wallReqs);
  const saved = Math.max(0, naive - plan.boardsNeeded);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Scissors className="h-5 w-5 text-primary" />
          <CardTitle>Obsessive Cut Optimizer</CardTitle>
          <Badge variant="accent" className="ml-1 gap-1">
            <Sparkles className="h-3 w-3" /> Kerf-aware
          </Badge>
        </div>
        <CardDescription>
          First-fit-decreasing bin packing that accounts for the saw kerf on every cut — so you buy
          the fewest boards and waste the least wood.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Kerf controls */}
        <div className="flex flex-wrap items-end gap-4 rounded-lg border bg-muted/30 p-4">
          <div className="space-y-1.5">
            <Label htmlFor="kerf">Saw kerf (in)</Label>
            <Input
              id="kerf"
              type="number"
              step="0.0625"
              min="0"
              value={kerf}
              onChange={(e) => setKerf(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-28"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {KERF_PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => setKerf(p.value)}
                className={`rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
                  kerf === p.value ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="ml-auto text-right text-sm text-muted-foreground">
            Stock length <span className="font-semibold text-foreground">{formatInches(stockLength)}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:grid-cols-4">
          <Stat label="Boards needed" value={String(plan.boardsNeeded)} accent />
          <Stat label="Boards saved" value={`${saved}`} hint={`vs ${naive} naive`} />
          <Stat label="Material efficiency" value={`${Math.round(plan.efficiency * 100)}%`} />
          <Stat label="Total waste" value={formatInches(plan.totalWaste)} />
        </div>

        {/* Per-board cut diagram */}
        <div className="space-y-2.5">
          {plan.boards.map((board) => (
            <div key={board.stockIndex} className="rounded-lg border p-3">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">Board {board.stockIndex + 1}</span>
                <span className="text-muted-foreground">
                  {board.cuts.length} cuts · {formatInches(board.wasteLength)} waste
                </span>
              </div>
              <div className="flex h-9 w-full overflow-hidden rounded-md border bg-muted">
                {board.cuts.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center border-r border-background/60 bg-primary/80 text-[10px] font-medium text-primary-foreground"
                    style={{ width: `${(c.length / board.stockLength) * 100}%` }}
                    title={`${c.label} — ${formatInches(c.length)}`}
                  >
                    {formatInches(c.length)}
                  </div>
                ))}
                {board.wasteLength > 0.01 && (
                  <div
                    className="flex items-center justify-center bg-destructive/15 text-[10px] text-destructive"
                    style={{ width: `${(board.wasteLength / board.stockLength) * 100}%` }}
                    title={`Waste — ${formatInches(board.wasteLength)}`}
                  >
                    waste
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-success/10 p-3 text-sm">
          <TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          <span className="text-muted-foreground">
            Optimizing for a <strong>{formatInches(kerf)}</strong> kerf packs {wallReqs.reduce((s, r) => s + r.quantity, 0)} wall
            cuts onto <strong>{plan.boardsNeeded} boards</strong> — saving {saved} board{saved === 1 ? "" : "s"} versus
            cutting one piece per board.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${accent ? "border-primary/40 bg-primary/5" : ""}`}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-2xl font-extrabold tabular-nums">{value}</div>
      {hint && <div className="text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}
