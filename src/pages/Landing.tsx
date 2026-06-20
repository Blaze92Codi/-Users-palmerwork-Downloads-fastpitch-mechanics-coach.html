import { Link, useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Boxes,
  Camera,
  Hammer,
  Layers,
  Ruler,
  ScanLine,
  Scissors,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const FEATURES = [
  { icon: Camera, title: "Snap the idea", text: "Upload inspiration photos and let BuildLens translate them into a buildable plan." },
  { icon: ScanLine, title: "Scan the space", text: "Capture your build site with LiDAR or photos — measurements come with confidence badges." },
  { icon: Layers, title: "Good / Better / Best", text: "Three material tiers with durability, cost, and effort tradeoffs laid out side by side." },
  { icon: Ruler, title: "SVG blueprints", text: "Auto-generated plan-view blueprints and a 3D / VR preview placeholder." },
  { icon: Scissors, title: "Obsessive cut optimizer", text: "Kerf-aware cutting plans that squeeze every inch out of your stock lumber." },
  { icon: Hammer, title: "Guided build + TWI", text: "Step-by-step instructions backed by TWI Job Instruction and Job Breakdown sheets." },
];

const INTEGRATIONS = ["AI Vision", "Supabase", "AR / LiDAR", "3D / VR", "Retailer Pricing"];

export function Landing() {
  const { projects } = useStore();
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b grid-bg">
        <div className="container relative py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 flex items-center justify-center gap-2.5">
              <img src="/logo.svg" alt="" className="h-12 w-12" />
              <span className="text-2xl font-bold tracking-tight">BuildLens AI</span>
            </div>
            <Badge variant="accent" className="mb-5 gap-1">
              <Sparkles className="h-3 w-3" /> MVP Preview
            </Badge>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight md:text-6xl">
              Snap the idea.<br className="hidden sm:block" /> Scan the space. Build it right.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
              BuildLens AI turns inspiration photos and a quick scan of your space into precise
              blueprints, optimized cut lists, local pricing, and a guided, safety-first build plan.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" onClick={() => navigate("/new")}>
                Start a project <ArrowRight className="h-4 w-4" />
              </Button>
              {projects[0] && (
                <Button size="lg" variant="outline" asChild>
                  <Link to={`/project/${projects[0].id}`}>Open the demo build</Link>
                </Button>
              )}
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Built to plug into
              </span>
              {INTEGRATIONS.map((i) => (
                <Badge key={i} variant="secondary">{i}</Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">From a photo to a finished build</h2>
          <p className="mt-3 text-muted-foreground">
            Every step of the DIY journey, obsessively planned — so you measure once and cut once.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{f.title}</CardTitle>
                <CardDescription>{f.text}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="border-t bg-muted/30">
        <div className="container py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Your projects</h2>
              <p className="mt-1 text-muted-foreground">Pick up where you left off, or start fresh.</p>
            </div>
            <Button onClick={() => navigate("/new")}>
              <Boxes className="h-4 w-4" /> New Project
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => {
              const tier = p.options.find((o) => o.tier === p.selectedTier);
              return (
                <Link key={p.id} to={`/project/${p.id}`}>
                  <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{p.type}</Badge>
                        <Badge variant="outline" className="capitalize">{p.status}</Badge>
                      </div>
                      <CardTitle className="mt-2">{p.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{p.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-success" />
                        {tier?.durabilityYears ?? "—"} yr build
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-foreground capitalize">
                        {p.selectedTier} tier <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-3 py-8 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} BuildLens AI — MVP</span>
          <span>Snap the idea. Scan the space. Build it right.</span>
        </div>
      </footer>
    </div>
  );
}
