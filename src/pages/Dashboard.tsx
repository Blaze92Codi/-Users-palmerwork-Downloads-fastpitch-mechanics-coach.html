import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useStore } from "@/lib/store";
import { quoteRetailers } from "@/lib/pricing";
import { deriveCuts } from "@/lib/deriveCuts";
import { optimizeCuts } from "@/lib/cutOptimizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { UploadSection } from "@/components/sections/UploadSection";
import { Measurements } from "@/components/sections/Measurements";
import { DesignOptions } from "@/components/sections/DesignOptions";
import { BlueprintPreview } from "@/components/sections/BlueprintPreview";
import { Preview3D } from "@/components/sections/Preview3D";
import { MaterialsList } from "@/components/sections/MaterialsList";
import { CutOptimizer } from "@/components/sections/CutOptimizer";
import { CostComparison } from "@/components/sections/CostComparison";
import { Timeline } from "@/components/sections/Timeline";
import { BuildSteps } from "@/components/sections/BuildSteps";
import { SafetyWarnings } from "@/components/sections/SafetyWarnings";
import { ExportPacket } from "@/components/sections/ExportPacket";
import {
  ArrowLeft,
  Box,
  Camera,
  DollarSign,
  Hammer,
  Layers,
  Package,
  Ruler,
  Scissors,
  ShieldCheck,
} from "lucide-react";

export function Dashboard() {
  const { id } = useParams();
  const { getProject } = useStore();
  const project = id ? getProject(id) : undefined;
  const [tab, setTab] = useState("design");

  if (!project) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <p className="mt-2 text-muted-foreground">It may have been removed or never existed.</p>
        <Button className="mt-6" asChild>
          <Link to="/"><ArrowLeft className="h-4 w-4" /> Back to projects</Link>
        </Button>
      </div>
    );
  }

  const option = project.options.find((o) => o.tier === project.selectedTier)!;
  const quote = quoteRetailers(option.materials)[0];
  const { requirements, stockLength } = deriveCuts(project);
  const wallReqs = requirements.filter((r) => r.stockLength === stockLength);
  const plan = optimizeCuts({ requirements: wallReqs, stockLength, kerf: project.cutKerf });

  return (
    <div className="container py-8">
      {/* Project header */}
      <div className="mb-6">
        <Link to="/" className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All projects
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <Badge variant="outline" className="capitalize">{project.status}</Badge>
            </div>
            <p className="mt-1 max-w-2xl text-muted-foreground">{project.description}</p>
          </div>
          <Badge variant="secondary" className="capitalize">{project.type}</Badge>
        </div>

        {/* Stat strip */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={Layers} label="Selected tier" value={option.title.split("—")[0].trim()} sub={`${option.durabilityYears} yr lifespan`} />
          <Stat icon={DollarSign} label="Materials (best price)" value={formatCurrency(quote.total)} sub={quote.retailer} />
          <Stat icon={Scissors} label="Boards needed" value={`${plan.boardsNeeded}`} sub={`${Math.round(plan.efficiency * 100)}% efficient`} />
          <Stat icon={ShieldCheck} label="Build time" value={`~${option.estimatedHours} hr`} sub={`${project.buildSteps.length} steps`} />
        </div>
      </div>

      {/* Section tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="capture"><Camera className="h-4 w-4" /> Capture</TabsTrigger>
          <TabsTrigger value="measure"><Ruler className="h-4 w-4" /> Measure</TabsTrigger>
          <TabsTrigger value="design"><Layers className="h-4 w-4" /> Design</TabsTrigger>
          <TabsTrigger value="model"><Box className="h-4 w-4" /> Blueprint</TabsTrigger>
          <TabsTrigger value="materials"><Hammer className="h-4 w-4" /> Materials</TabsTrigger>
          <TabsTrigger value="build"><ShieldCheck className="h-4 w-4" /> Build</TabsTrigger>
          <TabsTrigger value="export"><Package className="h-4 w-4" /> Export</TabsTrigger>
        </TabsList>

        <TabsContent value="capture" className="space-y-5">
          <UploadSection project={project} kind="inspiration" />
          <UploadSection project={project} kind="site" />
        </TabsContent>

        <TabsContent value="measure" className="space-y-5">
          <Measurements project={project} />
        </TabsContent>

        <TabsContent value="design" className="space-y-5">
          <DesignOptions project={project} />
        </TabsContent>

        <TabsContent value="model" className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <BlueprintPreview project={project} />
            <Preview3D />
          </div>
        </TabsContent>

        <TabsContent value="materials" className="space-y-5">
          <MaterialsList project={project} />
          <CutOptimizer project={project} />
          <CostComparison project={project} />
        </TabsContent>

        <TabsContent value="build" className="space-y-5">
          <SafetyWarnings project={project} />
          <Timeline project={project} />
          <BuildSteps project={project} />
        </TabsContent>

        <TabsContent value="export" className="space-y-5">
          <ExportPacket project={project} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Layers;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="truncate font-bold">{value}</div>
        <div className="truncate text-xs text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}
