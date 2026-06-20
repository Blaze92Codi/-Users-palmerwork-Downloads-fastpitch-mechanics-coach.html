// ---------------------------------------------------------------------------
// BuildLens AI — core domain types
// These model a single woodworking/DIY build project end-to-end. They are
// intentionally framework-agnostic and serialization-friendly so they can be
// persisted to Supabase (or any backend) later without changes.
// ---------------------------------------------------------------------------

export type ConfidenceLevel = "high" | "medium" | "low" | "ai" | "manual";

export type MeasurementSource =
  | "manual"
  | "lidar" // future: AR/LiDAR scan
  | "photo" // future: photogrammetry / AI vision
  | "estimate";

export interface Measurement {
  id: string;
  label: string;
  value: number; // stored in the project's base unit (inches)
  unit: "in" | "cm";
  source: MeasurementSource;
  confidence: ConfidenceLevel;
  note?: string;
}

export interface UploadedAsset {
  id: string;
  name: string;
  kind: "inspiration" | "site";
  dataUrl?: string; // base64 preview (local only for MVP)
  note?: string;
  createdAt: string;
}

export type OptionTier = "good" | "better" | "best";

export interface MaterialItem {
  id: string;
  name: string;
  spec: string; // e.g. "2x6x8 ft pressure-treated"
  quantity: number;
  unit: string; // "board", "bag", "box", "ft"
  unitLengthIn?: number; // stock length for cut optimization (boards)
  category: "lumber" | "hardware" | "soil" | "liner" | "finish" | "other";
}

export interface DesignOption {
  tier: OptionTier;
  title: string;
  summary: string;
  highlights: string[];
  materials: MaterialItem[];
  estimatedHours: number;
  durabilityYears: number;
}

// --- Cut optimization -------------------------------------------------------

export interface CutRequirement {
  id: string;
  label: string; // which part this cut becomes
  length: number; // inches
  quantity: number;
  stockLength: number; // inches of the stock board it comes from
  materialId: string;
}

export interface StockUsage {
  stockIndex: number;
  stockLength: number;
  cuts: { label: string; length: number }[];
  usedLength: number; // includes kerf
  wasteLength: number;
}

export interface CutPlan {
  kerf: number; // saw blade width, inches
  stockLength: number;
  boardsNeeded: number;
  boards: StockUsage[];
  totalWaste: number;
  totalStock: number;
  efficiency: number; // 0..1
}

// --- Pricing ----------------------------------------------------------------

export interface PriceQuote {
  retailer: string;
  total: number;
  lineItems: { name: string; qty: number; unitPrice: number; total: number }[];
  availability: "in-stock" | "limited" | "order";
  distanceMi: number;
}

// --- Build plan -------------------------------------------------------------

export type SafetySeverity = "info" | "caution" | "warning" | "danger";

export interface SafetyNote {
  id: string;
  severity: SafetySeverity;
  title: string;
  detail: string;
  ppe?: string[];
}

export interface TimelinePhase {
  id: string;
  name: string;
  durationLabel: string;
  description: string;
}

/** A TWI (Training Within Industry) Job Instruction step. */
export interface JobInstructionStep {
  id: string;
  importantStep: string; // WHAT to do — a logical segment of the operation
  keyPoint: string; // HOW — anything that makes or breaks the job, safety, knack
  reason: string; // WHY the key point matters
  safetyRef?: string; // id of a related SafetyNote
}

/** A row of the TWI Job Breakdown Sheet. */
export interface JobBreakdownRow {
  id: string;
  step: string;
  keyPoints: string[];
  reasons: string[];
  toolsMaterials: string[];
}

export interface BuildStep {
  id: string;
  order: number;
  title: string;
  detail: string;
  estMinutes: number;
  tools: string[];
  safetyRefs: string[];
}

// --- Project ----------------------------------------------------------------

export interface BlueprintPart {
  id: string;
  label: string;
  widthIn: number;
  heightIn: number;
  // position on the blueprint canvas (inches, top-left origin)
  x: number;
  y: number;
}

export interface Blueprint {
  name: string;
  canvasWidthIn: number;
  canvasHeightIn: number;
  parts: BlueprintPart[];
}

export type ProjectStatus = "draft" | "designing" | "ready" | "building" | "complete";

export interface Project {
  id: string;
  name: string;
  type: string; // "Raised Garden Bed"
  description: string;
  status: ProjectStatus;
  selectedTier: OptionTier;
  createdAt: string;
  unit: "imperial" | "metric";
  measurements: Measurement[];
  inspiration: UploadedAsset[];
  siteScans: UploadedAsset[];
  options: DesignOption[];
  blueprint: Blueprint;
  cutKerf: number;
  timeline: TimelinePhase[];
  buildSteps: BuildStep[];
  jobInstruction: JobInstructionStep[];
  jobBreakdown: JobBreakdownRow[];
  safety: SafetyNote[];
}
