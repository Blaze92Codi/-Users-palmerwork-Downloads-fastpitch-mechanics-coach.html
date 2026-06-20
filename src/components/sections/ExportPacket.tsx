import type { Project } from "@/lib/types";
import { deriveCuts } from "@/lib/deriveCuts";
import { optimizeCuts } from "@/lib/cutOptimizer";
import { quoteRetailers } from "@/lib/pricing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Download, FileText, Package } from "lucide-react";

const INCLUDES = [
  "Project summary & measurements",
  "Selected design tier & materials list",
  "Kerf-optimized cut plan",
  "Local pricing & cost comparison",
  "Guided build steps",
  "TWI Job Instruction & Job Breakdown Sheet",
  "Safety warnings & PPE",
];

export function ExportPacket({ project }: { project: Project }) {
  function buildPacket() {
    const option = project.options.find((o) => o.tier === project.selectedTier)!;
    const { requirements, stockLength } = deriveCuts(project);
    const wallReqs = requirements.filter((r) => r.stockLength === stockLength);
    const cutPlan = optimizeCuts({ requirements: wallReqs, stockLength, kerf: project.cutKerf });
    const quotes = quoteRetailers(option.materials);
    return {
      generatedAt: new Date().toISOString(),
      app: "BuildLens AI",
      project: {
        name: project.name,
        type: project.type,
        description: project.description,
        unit: project.unit,
        selectedTier: project.selectedTier,
      },
      measurements: project.measurements,
      design: option,
      cutPlan,
      pricing: quotes,
      timeline: project.timeline,
      buildSteps: project.buildSteps,
      jobInstruction: project.jobInstruction,
      jobBreakdown: project.jobBreakdown,
      safety: project.safety,
    };
  }

  function downloadJSON() {
    const blob = new Blob([JSON.stringify(buildPacket(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, "-").toLowerCase()}-build-packet.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <CardTitle>Export Build Packet</CardTitle>
        </div>
        <CardDescription>
          A single bundle with everything needed to shop for and build this project.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-2 sm:grid-cols-2">
          {INCLUDES.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              {item}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={downloadJSON}>
            <Download className="h-4 w-4" /> Download packet (JSON)
          </Button>
          <Button variant="outline" disabled>
            <FileText className="h-4 w-4" /> Printable PDF
            <Badge variant="accent" className="ml-1">Soon</Badge>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          The JSON export is live today and captures the full plan. A branded, printable PDF packet —
          plus direct-to-cart retailer handoff — are next on the roadmap.
        </p>
      </CardContent>
    </Card>
  );
}
