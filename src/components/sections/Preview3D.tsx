import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Box, Glasses, Rotate3d } from "lucide-react";

export function Preview3D() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Box className="h-5 w-5 text-primary" />
          <CardTitle>3D / VR Preview</CardTitle>
          <Badge variant="accent" className="ml-1">Coming soon</Badge>
        </div>
        <CardDescription>
          Walk around your build in 3D, or drop it into your space in AR before you cut a single board.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-xl border grid-bg">
          {/* faux isometric box */}
          <svg viewBox="0 0 240 200" className="h-48 w-48 opacity-90">
            <g stroke="hsl(152 56% 22%)" strokeWidth="2" strokeLinejoin="round">
              <polygon points="40,70 120,40 200,70 120,100" fill="hsl(152 56% 42%)" />
              <polygon points="40,70 120,100 120,160 40,130" fill="hsl(152 56% 32%)" />
              <polygon points="200,70 120,100 120,160 200,130" fill="hsl(152 46% 26%)" />
            </g>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 backdrop-blur-[1px]">
            <div className="flex gap-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-background/90 shadow">
                <Rotate3d className="h-5 w-5 text-primary" />
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-background/90 shadow">
                <Glasses className="h-5 w-5 text-accent" />
              </span>
            </div>
            <p className="mt-3 max-w-xs text-center text-sm text-muted-foreground">
              Interactive 3D model & WebXR walkthrough will render here once the modeling pipeline lands.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" disabled>
            <Rotate3d className="h-4 w-4" /> Orbit model
          </Button>
          <Button variant="outline" disabled>
            <Glasses className="h-4 w-4" /> View in AR
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
