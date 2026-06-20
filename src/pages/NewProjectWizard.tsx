import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore, type NewProjectInput } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Check, Ruler, Sprout, Table2, Warehouse } from "lucide-react";

const PROJECT_TYPES = [
  { type: "Raised Garden Bed", icon: Sprout, blurb: "Our flagship demo — sized for veggies & herbs", recommended: true },
  { type: "Workbench", icon: Table2, blurb: "A sturdy shop or garage work surface" },
  { type: "Storage Shelf", icon: Warehouse, blurb: "Modular shelving for any wall" },
  { type: "Custom", icon: Ruler, blurb: "Start from a blank build" },
];

const STEPS = ["Project type", "Details", "Units", "Review"];

export function NewProjectWizard() {
  const navigate = useNavigate();
  const { createProject } = useStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<NewProjectInput>({
    name: "Backyard Raised Garden Bed",
    type: "Raised Garden Bed",
    description:
      "A 4' x 8' x 16\" raised garden bed for the south-facing backyard with reinforced corner posts.",
    unit: "imperial",
  });

  const canNext =
    (step === 0 && !!form.type) ||
    (step === 1 && form.name.trim().length > 1) ||
    step === 2 ||
    step === 3;

  function finish() {
    const project = createProject(form);
    navigate(`/project/${project.id}`);
  }

  return (
    <div className="container max-w-3xl py-10">
      <button
        onClick={() => navigate("/")}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">New Project Wizard</h1>
        <p className="mt-1 text-muted-foreground">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </p>
        <Progress value={((step + 1) / STEPS.length) * 100} className="mt-4" />
      </div>

      <Card>
        <CardContent className="pt-6">
          {step === 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {PROJECT_TYPES.map((pt) => {
                const active = form.type === pt.type;
                return (
                  <button
                    key={pt.type}
                    onClick={() => setForm((f) => ({ ...f, type: pt.type }))}
                    className={cn(
                      "rounded-lg border p-4 text-left transition-all",
                      active ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "hover:border-primary/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <pt.icon className={cn("h-6 w-6", active ? "text-primary" : "text-muted-foreground")} />
                      {pt.recommended && <Badge variant="accent">Demo</Badge>}
                      {active && !pt.recommended && <Check className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="mt-3 font-semibold">{pt.type}</div>
                    <div className="text-sm text-muted-foreground">{pt.blurb}</div>
                  </button>
                );
              })}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Project name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Backyard Raised Garden Bed" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description & goals</Label>
                <Textarea id="desc" rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="What are you building and where?" />
                <p className="text-xs text-muted-foreground">
                  Tip: in a future release, this is where BuildLens AI will read your inspiration photos and draft this for you.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <Label>Measurement units</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                {(["imperial", "metric"] as const).map((u) => {
                  const active = form.unit === u;
                  return (
                    <button
                      key={u}
                      onClick={() => setForm((f) => ({ ...f, unit: u }))}
                      className={cn(
                        "rounded-lg border p-4 text-left capitalize transition-all",
                        active ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "hover:border-primary/40"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{u}</span>
                        {active && <Check className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {u === "imperial" ? "Inches & feet (US)" : "Centimeters & meters"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Review & create</CardTitle>
                <CardDescription>Your project starts pre-loaded with the full demo plan so you can explore every tool immediately.</CardDescription>
              </CardHeader>
              <dl className="divide-y rounded-lg border">
                <Row label="Type" value={form.type} />
                <Row label="Name" value={form.name} />
                <Row label="Units" value={form.unit} className="capitalize" />
                <Row label="Description" value={form.description} />
              </dl>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={finish}>
            <Check className="h-4 w-4" /> Create project
          </Button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className={cn("col-span-2 text-sm", className)}>{value}</dd>
    </div>
  );
}
