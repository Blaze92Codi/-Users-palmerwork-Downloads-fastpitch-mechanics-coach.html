import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Measurement, OptionTier, Project, UploadedAsset } from "./types";
import { createDemoProject } from "./demoProject";
import { uid } from "./utils";

const STORAGE_KEY = "buildlens.projects.v1";

interface StoreValue {
  projects: Project[];
  getProject: (id: string) => Project | undefined;
  createProject: (input: NewProjectInput) => Project;
  updateProject: (id: string, patch: Partial<Project>) => void;
  addMeasurement: (projectId: string, m: Omit<Measurement, "id">) => void;
  removeMeasurement: (projectId: string, measurementId: string) => void;
  addAsset: (projectId: string, asset: Omit<UploadedAsset, "id" | "createdAt">) => void;
  removeAsset: (projectId: string, assetId: string) => void;
  setTier: (projectId: string, tier: OptionTier) => void;
  resetDemo: () => void;
}

export interface NewProjectInput {
  name: string;
  type: string;
  description: string;
  unit: "imperial" | "metric";
}

const StoreContext = createContext<StoreValue | null>(null);

function load(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Project[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {
    // ignore corrupt storage
  }
  return [createDemoProject()];
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // storage full / unavailable — non-fatal for the MVP
    }
  }, [projects]);

  const getProject = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects]
  );

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const createProject = useCallback((input: NewProjectInput) => {
    // Seed every new project from the fully-worked demo so the experience is
    // populated end-to-end, then overlay the user's identifying fields.
    const base = createDemoProject();
    const project: Project = {
      ...base,
      id: uid("proj"),
      name: input.name || base.name,
      type: input.type || base.type,
      description: input.description || base.description,
      unit: input.unit,
      status: "designing",
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [project, ...prev]);
    return project;
  }, []);

  const addMeasurement = useCallback((projectId: string, m: Omit<Measurement, "id">) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, measurements: [...p.measurements, { ...m, id: uid("m") }] }
          : p
      )
    );
  }, []);

  const removeMeasurement = useCallback((projectId: string, measurementId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, measurements: p.measurements.filter((m) => m.id !== measurementId) }
          : p
      )
    );
  }, []);

  const addAsset = useCallback((projectId: string, asset: Omit<UploadedAsset, "id" | "createdAt">) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const full: UploadedAsset = { ...asset, id: uid("asset"), createdAt: new Date().toISOString() };
        return asset.kind === "inspiration"
          ? { ...p, inspiration: [...p.inspiration, full] }
          : { ...p, siteScans: [...p.siteScans, full] };
      })
    );
  }, []);

  const removeAsset = useCallback((projectId: string, assetId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              inspiration: p.inspiration.filter((a) => a.id !== assetId),
              siteScans: p.siteScans.filter((a) => a.id !== assetId),
            }
          : p
      )
    );
  }, []);

  const setTier = useCallback((projectId: string, tier: OptionTier) => {
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, selectedTier: tier } : p)));
  }, []);

  const resetDemo = useCallback(() => {
    setProjects([createDemoProject()]);
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      projects,
      getProject,
      createProject,
      updateProject,
      addMeasurement,
      removeMeasurement,
      addAsset,
      removeAsset,
      setTier,
      resetDemo,
    }),
    [projects, getProject, createProject, updateProject, addMeasurement, removeMeasurement, addAsset, removeAsset, setTier, resetDemo]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}
