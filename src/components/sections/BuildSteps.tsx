import { useState } from "react";
import type { Project } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, ClipboardList, GraduationCap, ListChecks, ShieldAlert, Wrench } from "lucide-react";

export function BuildSteps({ project }: { project: Project }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" />
          <CardTitle>Guided Build</CardTitle>
        </div>
        <CardDescription>
          Follow the steps, or drill into the TWI training documents that standardize how the job is done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="guided">
          <TabsList>
            <TabsTrigger value="guided">
              <ListChecks className="h-4 w-4" /> Guided Steps
            </TabsTrigger>
            <TabsTrigger value="ji">
              <GraduationCap className="h-4 w-4" /> TWI Job Instruction
            </TabsTrigger>
            <TabsTrigger value="jbs">
              <ClipboardList className="h-4 w-4" /> Job Breakdown Sheet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guided">
            <GuidedSteps project={project} />
          </TabsContent>
          <TabsContent value="ji">
            <JobInstruction project={project} />
          </TabsContent>
          <TabsContent value="jbs">
            <JobBreakdown project={project} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function GuidedSteps({ project }: { project: Project }) {
  const [done, setDone] = useState<Set<string>>(new Set());
  const safetyById = new Map(project.safety.map((s) => [s.id, s]));
  const totalMin = project.buildSteps.reduce((s, b) => s + b.estMinutes, 0);

  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{done.size} of {project.buildSteps.length} steps complete</span>
        <span>Est. total ~{Math.round(totalMin / 60 * 10) / 10} hr</span>
      </div>
      {project.buildSteps.map((step) => {
        const isDone = done.has(step.id);
        return (
          <div
            key={step.id}
            className={cn("rounded-lg border p-4 transition-colors", isDone && "bg-success/5 border-success/40")}
          >
            <div className="flex items-start gap-3">
              <button onClick={() => toggle(step.id)} className="mt-0.5 shrink-0" aria-label="Toggle step">
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground">STEP {step.order}</span>
                  <h4 className={cn("font-semibold", isDone && "line-through opacity-70")}>{step.title}</h4>
                  <Badge variant="secondary">{step.estMinutes} min</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{step.detail}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {step.tools.map((t) => (
                    <Badge key={t} variant="outline" className="gap-1 font-normal">
                      <Wrench className="h-3 w-3" /> {t}
                    </Badge>
                  ))}
                  {step.safetyRefs.map((ref) => {
                    const s = safetyById.get(ref);
                    if (!s) return null;
                    return (
                      <Badge key={ref} variant="warning" className="gap-1">
                        <ShieldAlert className="h-3 w-3" /> {s.title}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function JobInstruction({ project }: { project: Project }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        TWI <strong>Job Instruction</strong> breaks the operation into Important Steps, the Key Points
        that make or break each one, and the Reasons why — the proven way to train a build correctly.
      </p>
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-muted-foreground">
            <tr>
              <th className="w-10 px-3 py-2.5 font-medium">#</th>
              <th className="px-3 py-2.5 font-medium">Important Step (what)</th>
              <th className="px-3 py-2.5 font-medium">Key Point (how)</th>
              <th className="px-3 py-2.5 font-medium">Reason (why)</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {project.jobInstruction.map((s, i) => (
              <tr key={s.id} className="align-top hover:bg-muted/30">
                <td className="px-3 py-3 font-bold text-muted-foreground">{i + 1}</td>
                <td className="px-3 py-3 font-medium">{s.importantStep}</td>
                <td className="px-3 py-3 text-muted-foreground">{s.keyPoint}</td>
                <td className="px-3 py-3 text-muted-foreground">{s.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function JobBreakdown({ project }: { project: Project }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        The <strong>Job Breakdown Sheet</strong> is the instructor's reference — every step with its key
        points, reasons, and the tools & materials needed to perform it.
      </p>
      <div className="space-y-3">
        {project.jobBreakdown.map((row, i) => (
          <div key={row.id} className="rounded-lg border">
            <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <span className="font-semibold">{row.step}</span>
            </div>
            <div className="grid gap-4 p-4 sm:grid-cols-3">
              <BreakdownCol title="Key Points" items={row.keyPoints} />
              <BreakdownCol title="Reasons" items={row.reasons} />
              <BreakdownCol title="Tools & Materials" items={row.toolsMaterials} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BreakdownCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>
      <ul className="space-y-1 text-sm">
        {items.map((it, i) => (
          <li key={i} className="flex gap-1.5">
            <span className="text-primary">•</span> {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
