import { useState } from "react";
import { useStore } from "@/lib/store";
import type { ConfidenceLevel, MeasurementSource, Project } from "@/lib/types";
import { ConfidenceBadge, SourceBadge } from "@/components/ConfidenceBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatInches } from "@/lib/utils";
import { Plus, Ruler, Trash2 } from "lucide-react";

export function Measurements({ project }: { project: Project }) {
  const { addMeasurement, removeMeasurement } = useStore();
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [confidence, setConfidence] = useState<ConfidenceLevel>("manual");

  function submit() {
    const num = parseFloat(value);
    if (!label.trim() || isNaN(num)) return;
    const source: MeasurementSource = "manual";
    addMeasurement(project.id, {
      label: label.trim(),
      value: num,
      unit: project.unit === "imperial" ? "in" : "cm",
      source,
      confidence,
    });
    setLabel("");
    setValue("");
    setConfidence("manual");
  }

  const lowConfidence = project.measurements.filter((m) => m.confidence === "low").length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Ruler className="h-5 w-5 text-primary" />
          <CardTitle>Measurements</CardTitle>
        </div>
        <CardDescription>
          Enter dimensions manually, or let an AR / LiDAR scan fill them in. Each value carries a
          confidence badge so you know what to double-check.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Manual entry */}
        <div className="grid items-end gap-3 rounded-lg border bg-muted/30 p-4 sm:grid-cols-[1fr_auto_auto_auto]">
          <div className="space-y-1.5">
            <Label htmlFor="m-label">Measurement</Label>
            <Input id="m-label" value={label} placeholder="e.g. Bed length" onChange={(e) => setLabel(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="m-value">Value ({project.unit === "imperial" ? "in" : "cm"})</Label>
            <Input id="m-value" type="number" step="0.125" value={value} placeholder="96" onChange={(e) => setValue(e.target.value)} className="w-28" onKeyDown={(e) => e.key === "Enter" && submit()} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="m-conf">Confidence</Label>
            <select
              id="m-conf"
              value={confidence}
              onChange={(e) => setConfidence(e.target.value as ConfidenceLevel)}
              className="flex h-10 w-36 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="manual">Manual entry</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low — verify</option>
            </select>
          </div>
          <Button onClick={submit}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>

        {lowConfidence > 0 && (
          <div className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-2.5 text-sm text-warning-foreground">
            {lowConfidence} measurement{lowConfidence === 1 ? "" : "s"} marked low-confidence — verify with a tape or level before cutting.
          </div>
        )}

        {/* List */}
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">Measurement</th>
                <th className="px-4 py-2.5 font-medium">Value</th>
                <th className="px-4 py-2.5 font-medium">Source</th>
                <th className="px-4 py-2.5 font-medium">Confidence</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {project.measurements.map((m) => (
                <tr key={m.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-medium">{m.label}</div>
                    {m.note && <div className="text-xs text-muted-foreground">{m.note}</div>}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {m.unit === "in" ? formatInches(m.value) : `${m.value} cm`}
                  </td>
                  <td className="px-4 py-3"><SourceBadge source={m.source} /></td>
                  <td className="px-4 py-3"><ConfidenceBadge level={m.confidence} /></td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeMeasurement(project.id, m.id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove measurement"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
