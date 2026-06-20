import type { Project } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarRange } from "lucide-react";

export function Timeline({ project }: { project: Project }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarRange className="h-5 w-5 text-primary" />
          <CardTitle>Project Timeline</CardTitle>
        </div>
        <CardDescription>A realistic plan from shopping cart to first harvest.</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="relative space-y-6 border-l pl-6">
          {project.timeline.map((phase, i) => (
            <li key={phase.id} className="relative">
              <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground ring-4 ring-background">
                {i + 1}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-semibold">{phase.name}</h4>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                  {phase.durationLabel}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{phase.description}</p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
