import type { Project } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatInches } from "@/lib/utils";
import { Ruler } from "lucide-react";

export function BlueprintPreview({ project }: { project: Project }) {
  const bp = project.blueprint;
  const pad = 12; // inches of margin around the drawing
  const W = bp.canvasWidthIn + pad * 2;
  const H = bp.canvasHeightIn + pad * 2;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Ruler className="h-5 w-5 text-primary" />
          <CardTitle>SVG Blueprint — Plan View</CardTitle>
        </div>
        <CardDescription>
          Auto-generated, to-scale plan view. Dimensions update as your measurements change.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="overflow-hidden rounded-lg border bg-[hsl(210_40%_98%)] dark:bg-muted/20">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Plan view blueprint">
            {/* grid */}
            <defs>
              <pattern id="bpgrid" width="6" height="6" patternUnits="userSpaceOnUse">
                <path d="M 6 0 L 0 0 0 6" fill="none" stroke="hsl(210 30% 88%)" strokeWidth="0.3" />
              </pattern>
              <pattern id="bpgrid-lg" width="12" height="12" patternUnits="userSpaceOnUse">
                <path d="M 12 0 L 0 0 0 12" fill="none" stroke="hsl(210 30% 80%)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width={W} height={H} fill="url(#bpgrid)" />
            <rect width={W} height={H} fill="url(#bpgrid-lg)" />

            <g transform={`translate(${pad}, ${pad})`}>
              {/* outline */}
              <rect
                x={0}
                y={0}
                width={bp.canvasWidthIn}
                height={bp.canvasHeightIn}
                fill="none"
                stroke="hsl(152 56% 32%)"
                strokeWidth="0.6"
                strokeDasharray="2 1.5"
              />
              {/* parts */}
              {bp.parts.map((part) => {
                const isPost = part.label.toLowerCase().startsWith("post");
                return (
                  <g key={part.id}>
                    <rect
                      x={part.x}
                      y={part.y}
                      width={part.widthIn}
                      height={part.heightIn}
                      rx={0.5}
                      fill={isPost ? "hsl(28 90% 54% / 0.85)" : "hsl(152 56% 32% / 0.85)"}
                      stroke={isPost ? "hsl(28 80% 40%)" : "hsl(152 56% 22%)"}
                      strokeWidth="0.4"
                    />
                  </g>
                );
              })}

              {/* width dimension */}
              <g stroke="hsl(215 16% 47%)" strokeWidth="0.3">
                <line x1={0} y1={-6} x2={bp.canvasWidthIn} y2={-6} />
                <line x1={0} y1={-7.5} x2={0} y2={-4.5} />
                <line x1={bp.canvasWidthIn} y1={-7.5} x2={bp.canvasWidthIn} y2={-4.5} />
              </g>
              <text x={bp.canvasWidthIn / 2} y={-8} textAnchor="middle" fontSize="4" fill="hsl(215 16% 35%)">
                {formatInches(bp.canvasWidthIn)}
              </text>

              {/* height dimension */}
              <g stroke="hsl(215 16% 47%)" strokeWidth="0.3">
                <line x1={-6} y1={0} x2={-6} y2={bp.canvasHeightIn} />
                <line x1={-7.5} y1={0} x2={-4.5} y2={0} />
                <line x1={-7.5} y1={bp.canvasHeightIn} x2={-4.5} y2={bp.canvasHeightIn} />
              </g>
              <text
                x={-8}
                y={bp.canvasHeightIn / 2}
                textAnchor="middle"
                fontSize="4"
                fill="hsl(215 16% 35%)"
                transform={`rotate(-90, -8, ${bp.canvasHeightIn / 2})`}
              >
                {formatInches(bp.canvasHeightIn)}
              </text>
            </g>
          </svg>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-primary/80" /> Walls
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-accent/80" /> Corner posts
          </span>
          <Badge variant="secondary" className="ml-auto">{bp.parts.length} parts</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
