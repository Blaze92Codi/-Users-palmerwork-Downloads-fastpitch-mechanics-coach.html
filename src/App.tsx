import { Link, Route, Routes, useLocation } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { NewProjectWizard } from "./pages/NewProjectWizard";
import { Dashboard } from "./pages/Dashboard";
import { Button } from "./components/ui/button";
import { Compass } from "lucide-react";

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <img src="/logo.svg" alt="BuildLens AI" className="h-8 w-8" />
      <div className="leading-tight">
        <div className="font-bold tracking-tight">BuildLens AI</div>
        <div className="hidden text-[11px] text-muted-foreground sm:block">
          Snap the idea. Scan the space. Build it right.
        </div>
      </div>
    </Link>
  );
}

export default function App() {
  const location = useLocation();
  const onLanding = location.pathname === "/";

  return (
    <div className="min-h-screen bg-background">
      {!onLanding && (
        <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <Brand />
            <nav className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">Projects</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/new">
                  <Compass className="h-4 w-4" /> New Project
                </Link>
              </Button>
            </nav>
          </div>
        </header>
      )}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/new" element={<NewProjectWizard />} />
        <Route path="/project/:id" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
