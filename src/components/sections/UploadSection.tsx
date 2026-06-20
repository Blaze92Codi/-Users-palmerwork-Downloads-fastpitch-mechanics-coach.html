import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import type { Project, UploadedAsset } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ImagePlus, ScanLine, Sparkles, Trash2, UploadCloud } from "lucide-react";

interface Props {
  project: Project;
  kind: "inspiration" | "site";
}

const COPY = {
  inspiration: {
    title: "Inspiration",
    description: "Drop in photos of builds you love. AI vision will translate them into a plan (coming soon).",
    icon: ImagePlus,
    accept: "image/*",
    hint: "JPG, PNG, HEIC",
    future: "AI Vision will auto-extract style, dimensions, and materials from these photos.",
  },
  site: {
    title: "Build Site",
    description: "Upload photos or an AR / LiDAR scan of where this will be built.",
    icon: ScanLine,
    accept: "image/*,.usdz,.ply,.obj",
    hint: "JPG, PNG, USDZ, PLY",
    future: "AR / LiDAR scans will auto-generate measurements with confidence scores.",
  },
} as const;

export function UploadSection({ project, kind }: Props) {
  const { addAsset, removeAsset } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const copy = COPY[kind];
  const Icon = copy.icon;
  const assets: UploadedAsset[] = kind === "inspiration" ? project.inspiration : project.siteScans;

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith("image/");
      if (isImage) {
        const reader = new FileReader();
        reader.onload = () =>
          addAsset(project.id, { name: file.name, kind, dataUrl: String(reader.result) });
        reader.readAsDataURL(file);
      } else {
        addAsset(project.id, { name: file.name, kind, note: "Scan file" });
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <CardTitle>{copy.title} Upload</CardTitle>
        </div>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-colors",
            dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          )}
        >
          <UploadCloud className="mb-3 h-9 w-9 text-muted-foreground" />
          <p className="font-medium">Drag & drop or click to upload</p>
          <p className="text-sm text-muted-foreground">{copy.hint}</p>
          <Input
            ref={inputRef}
            type="file"
            multiple
            accept={copy.accept}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-accent/10 p-3 text-sm">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <span className="text-muted-foreground">{copy.future}</span>
        </div>

        {assets.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((a) => (
              <div key={a.id} className="group relative overflow-hidden rounded-lg border">
                <div className="flex h-32 items-center justify-center bg-muted">
                  {a.dataUrl ? (
                    <img src={a.dataUrl} alt={a.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <ScanLine className="h-7 w-7" />
                      <span className="mt-1 text-xs">Scan file</span>
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="truncate text-sm font-medium">{a.name}</p>
                  {a.note && <p className="truncate text-xs text-muted-foreground">{a.note}</p>}
                </div>
                <button
                  onClick={() => removeAsset(project.id, a.id)}
                  className="absolute right-2 top-2 rounded-md bg-background/90 p-1.5 text-destructive opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {assets.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            No {kind === "inspiration" ? "inspiration images" : "site scans"} yet.
          </p>
        )}

        <Badge variant="secondary">{assets.length} item{assets.length === 1 ? "" : "s"}</Badge>
      </CardContent>
    </Card>
  );
}
