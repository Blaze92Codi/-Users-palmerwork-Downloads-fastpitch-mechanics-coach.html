import type {
  BuildStep,
  DesignOption,
  JobBreakdownRow,
  JobInstructionStep,
  Measurement,
  Project,
  SafetyNote,
  TimelinePhase,
} from "./types";
import { uid } from "./utils";

// ---------------------------------------------------------------------------
// Demo project: a 4' x 8' x 16" raised garden bed.
// This is the canonical first-run experience for BuildLens AI. Every section
// of the app is fully populated so the product story reads end-to-end.
// ---------------------------------------------------------------------------

const measurements: Measurement[] = [
  { id: uid("m"), label: "Bed length", value: 96, unit: "in", source: "lidar", confidence: "high", note: "Scanned along the south fence" },
  { id: uid("m"), label: "Bed width", value: 48, unit: "in", source: "lidar", confidence: "high" },
  { id: uid("m"), label: "Bed height", value: 16, unit: "in", source: "manual", confidence: "manual", note: "Two 2x8 courses" },
  { id: uid("m"), label: "Wall board thickness", value: 1.5, unit: "in", source: "manual", confidence: "high" },
  { id: uid("m"), label: "Site slope drop", value: 2.25, unit: "in", source: "photo", confidence: "low", note: "Estimated from site photo — verify with a level" },
  { id: uid("m"), label: "Available sun clearance", value: 72, unit: "in", source: "estimate", confidence: "medium" },
];

const safety: SafetyNote[] = [
  {
    id: "sf_ppe",
    severity: "warning",
    title: "Eye & ear protection required",
    detail: "Sawing and driving fasteners throws debris and is loud enough to damage hearing over time.",
    ppe: ["Safety glasses", "Ear protection", "Work gloves"],
  },
  {
    id: "sf_pt",
    severity: "caution",
    title: "Pressure-treated lumber handling",
    detail: "Wash hands after handling PT lumber and never burn offcuts. Wear a dust mask when cutting.",
    ppe: ["Dust mask", "Gloves"],
  },
  {
    id: "sf_lift",
    severity: "caution",
    title: "Heavy / awkward lifts",
    detail: "Filled beds and full soil bags are heavy. Lift with your legs and use a helper for the assembled frame.",
  },
  {
    id: "sf_dig",
    severity: "danger",
    title: "Call before you dig",
    detail: "If anchoring posts below grade, call 811 to locate buried utilities before driving stakes or digging.",
  },
  {
    id: "sf_saw",
    severity: "warning",
    title: "Circular saw kickback",
    detail: "Support both sides of the cut, keep the guard free, and never reach under the workpiece while the blade spins.",
    ppe: ["Safety glasses"],
  },
];

const options: DesignOption[] = [
  {
    tier: "good",
    title: "Good — Budget Pine",
    summary: "Untreated pine frame. Lowest cost, gets you growing this weekend.",
    estimatedHours: 2.5,
    durabilityYears: 4,
    highlights: ["Lowest upfront cost", "Lightweight & easy to cut", "Great for annual veggies"],
    materials: [
      { id: uid("mat"), name: "Side / end walls", spec: "2x8x8 pine", quantity: 6, unit: "board", unitLengthIn: 96, category: "lumber" },
      { id: uid("mat"), name: "Corner posts", spec: "2x4x8", quantity: 1, unit: "board", unitLengthIn: 96, category: "lumber" },
      { id: uid("mat"), name: "Corner brackets", spec: "corner bracket", quantity: 8, unit: "box", category: "hardware" },
      { id: uid("mat"), name: "Exterior screws", spec: "exterior screws 2.5in", quantity: 1, unit: "box", category: "hardware" },
      { id: uid("mat"), name: "Garden soil", spec: "garden soil 1.5cf", quantity: 16, unit: "bag", category: "soil" },
    ],
  },
  {
    tier: "better",
    title: "Better — Pressure-Treated",
    summary: "Ground-contact PT lumber with reinforced corners. The practical sweet spot.",
    estimatedHours: 3,
    durabilityYears: 12,
    highlights: ["Rot & insect resistant", "Reinforced 4x4 corner posts", "Best value over its lifetime"],
    materials: [
      { id: uid("mat"), name: "Side / end walls", spec: "2x6x8 pt", quantity: 8, unit: "board", unitLengthIn: 96, category: "lumber" },
      { id: uid("mat"), name: "Corner posts", spec: "4x4x8 pt", quantity: 1, unit: "board", unitLengthIn: 96, category: "lumber" },
      { id: uid("mat"), name: "Corner brackets", spec: "corner bracket", quantity: 8, unit: "box", category: "hardware" },
      { id: uid("mat"), name: "Exterior screws", spec: "exterior screws 3in", quantity: 1, unit: "box", category: "hardware" },
      { id: uid("mat"), name: "Landscape fabric", spec: "landscape fabric 4x12", quantity: 1, unit: "roll", category: "liner" },
      { id: uid("mat"), name: "Garden soil", spec: "garden soil 1.5cf", quantity: 16, unit: "bag", category: "soil" },
    ],
  },
  {
    tier: "best",
    title: "Best — Western Red Cedar",
    summary: "Naturally rot-resistant cedar, mitered corners, and a sealed finish. Heirloom quality.",
    estimatedHours: 4.5,
    durabilityYears: 20,
    highlights: ["Naturally rot & pest resistant", "Food-safe, no chemicals", "Beautiful sealed finish", "20+ year lifespan"],
    materials: [
      { id: uid("mat"), name: "Side / end walls", spec: "2x8x8 cedar", quantity: 6, unit: "board", unitLengthIn: 96, category: "lumber" },
      { id: uid("mat"), name: "Corner posts", spec: "4x4x8 cedar", quantity: 1, unit: "board", unitLengthIn: 96, category: "lumber" },
      { id: uid("mat"), name: "Stainless brackets", spec: "corner bracket ss", quantity: 8, unit: "box", category: "hardware" },
      { id: uid("mat"), name: "Stainless screws", spec: "exterior screws ss 3in", quantity: 1, unit: "box", category: "hardware" },
      { id: uid("mat"), name: "Landscape fabric", spec: "landscape fabric 4x12", quantity: 1, unit: "roll", category: "liner" },
      { id: uid("mat"), name: "Wood sealer", spec: "wood sealer 1gal", quantity: 1, unit: "can", category: "finish" },
      { id: uid("mat"), name: "Garden soil", spec: "garden soil 1.5cf", quantity: 16, unit: "bag", category: "soil" },
    ],
  },
];

const timeline: TimelinePhase[] = [
  { id: uid("t"), name: "Plan & shop", durationLabel: "Day 0 · 1 hr", description: "Confirm measurements, pick a retailer, and gather materials & tools." },
  { id: uid("t"), name: "Cut & prep", durationLabel: "Day 1 · 45 min", description: "Cut walls and posts to length following the optimized cut list." },
  { id: uid("t"), name: "Assemble frame", durationLabel: "Day 1 · 1 hr", description: "Build the box, attach corner posts, square and fasten." },
  { id: uid("t"), name: "Site & level", durationLabel: "Day 1 · 30 min", description: "Place the bed, level it, and line the interior." },
  { id: uid("t"), name: "Fill & plant", durationLabel: "Day 2 · 45 min", description: "Add soil in lifts, water to settle, then plant." },
];

const jobInstruction: JobInstructionStep[] = [
  { id: uid("ji"), importantStep: "Cut the wall boards to length", keyPoint: "Mark from the factory end; cut on the waste side of the line", reason: "Keeps every wall identical so corners close square", safetyRef: "sf_saw" },
  { id: uid("ji"), importantStep: "Attach corner posts to one long wall", keyPoint: "Hold the post flush to the top edge and inside face", reason: "A flush top gives a clean rim; inside-set posts hide end grain", safetyRef: "sf_ppe" },
  { id: uid("ji"), importantStep: "Join the second long wall", keyPoint: "Pre-drill near board ends", reason: "Prevents the lumber from splitting at the fastener", safetyRef: "sf_ppe" },
  { id: uid("ji"), importantStep: "Add the end walls to form the box", keyPoint: "Check diagonal-to-diagonal measurements are equal", reason: "Equal diagonals means the frame is truly square", safetyRef: "sf_lift" },
  { id: uid("ji"), importantStep: "Set & level the bed on site", keyPoint: "Shim the low corner until the bubble centers", reason: "An unlevel bed drains unevenly and stresses the joints", safetyRef: "sf_dig" },
];

const jobBreakdown: JobBreakdownRow[] = [
  {
    id: uid("jb"),
    step: "Prepare & cut lumber",
    keyPoints: ["Measure twice, cut once", "Cut on waste side of line", "Stack cut pieces by part"],
    reasons: ["Avoids short, unusable boards", "Holds the finished dimension", "Speeds assembly"],
    toolsMaterials: ["Tape measure", "Speed square", "Circular saw", "Wall & post stock"],
  },
  {
    id: uid("jb"),
    step: "Assemble the frame",
    keyPoints: ["Pre-drill ends", "Keep tops flush", "Drive screws snug, not stripped"],
    reasons: ["Prevents splitting", "Clean even rim", "Maintains clamping force"],
    toolsMaterials: ["Drill/driver", "Exterior screws", "Corner brackets", "Clamps"],
  },
  {
    id: uid("jb"),
    step: "Square & verify",
    keyPoints: ["Equalize diagonals", "Recheck after fastening"],
    reasons: ["Confirms square", "Fastening can pull frame out"],
    toolsMaterials: ["Tape measure", "Framing square"],
  },
  {
    id: uid("jb"),
    step: "Site, level & line",
    keyPoints: ["Clear & flatten ground", "Shim to level", "Staple fabric to inside walls"],
    reasons: ["Stable base", "Even drainage", "Blocks weeds, slows rot"],
    toolsMaterials: ["Level", "Shims", "Landscape fabric", "Staple gun"],
  },
  {
    id: uid("jb"),
    step: "Fill & plant",
    keyPoints: ["Add soil in lifts", "Water between lifts", "Leave 1-2in rim"],
    reasons: ["Reduces settling", "Removes air pockets", "Prevents overflow when watering"],
    toolsMaterials: ["Garden soil", "Garden hose", "Gloves"],
  },
];

const buildSteps: BuildStep[] = [
  { id: uid("bs"), order: 1, title: "Stage your work area", detail: "Lay out boards on sawhorses or a flat surface. Confirm the cut list and label parts.", estMinutes: 15, tools: ["Sawhorses", "Pencil", "Tape measure"], safetyRefs: ["sf_ppe"] },
  { id: uid("bs"), order: 2, title: "Cut walls & posts", detail: "Following the optimized cut list, cut all wall boards and the corner posts to length.", estMinutes: 30, tools: ["Circular saw", "Speed square", "Clamps"], safetyRefs: ["sf_saw", "sf_pt"] },
  { id: uid("bs"), order: 3, title: "Build the long walls", detail: "Stack two courses per long side and fasten corner posts flush to the top and inside face.", estMinutes: 25, tools: ["Drill/driver", "Screws"], safetyRefs: ["sf_ppe"] },
  { id: uid("bs"), order: 4, title: "Close the box", detail: "Attach the end walls between the long walls. Pre-drill, then drive screws into the posts.", estMinutes: 20, tools: ["Drill/driver", "Clamps"], safetyRefs: ["sf_ppe", "sf_lift"] },
  { id: uid("bs"), order: 5, title: "Square & reinforce", detail: "Measure diagonals and adjust until equal, then add corner brackets inside.", estMinutes: 15, tools: ["Tape measure", "Brackets"], safetyRefs: [] },
  { id: uid("bs"), order: 6, title: "Place, level & line", detail: "Move the bed to its spot, level it with shims, and staple landscape fabric to the inside.", estMinutes: 25, tools: ["Level", "Shims", "Staple gun"], safetyRefs: ["sf_lift", "sf_dig"] },
  { id: uid("bs"), order: 7, title: "Fill & plant", detail: "Add soil in lifts, watering to settle each layer, leaving a 1-2in rim. Then plant.", estMinutes: 45, tools: ["Wheelbarrow", "Hose"], safetyRefs: ["sf_lift"] },
];

export function createDemoProject(): Project {
  return {
    id: uid("proj"),
    name: "Backyard Raised Garden Bed",
    type: "Raised Garden Bed",
    description:
      "A 4' x 8' x 16\" raised garden bed for the south-facing backyard. Two-course walls with reinforced corner posts, sized for vegetables and herbs.",
    status: "designing",
    selectedTier: "better",
    createdAt: new Date().toISOString(),
    unit: "imperial",
    measurements,
    inspiration: [
      { id: uid("ins"), name: "pinterest-cedar-bed.jpg", kind: "inspiration", note: "Love the mitered cedar corners", createdAt: new Date().toISOString() },
      { id: uid("ins"), name: "neighbor-bed.jpg", kind: "inspiration", note: "Good height for no-bend weeding", createdAt: new Date().toISOString() },
    ],
    siteScans: [
      { id: uid("site"), name: "south-yard-scan.usdz", kind: "site", note: "LiDAR scan of the install area", createdAt: new Date().toISOString() },
    ],
    options,
    blueprint: {
      name: "Raised Bed — Plan View",
      canvasWidthIn: 96,
      canvasHeightIn: 48,
      parts: [
        { id: uid("p"), label: "Long wall A (96\")", widthIn: 96, heightIn: 1.5, x: 0, y: 0 },
        { id: uid("p"), label: "Long wall B (96\")", widthIn: 96, heightIn: 1.5, x: 0, y: 46.5 },
        { id: uid("p"), label: "End wall (45\")", widthIn: 1.5, heightIn: 45, x: 0, y: 1.5 },
        { id: uid("p"), label: "End wall (45\")", widthIn: 1.5, heightIn: 45, x: 94.5, y: 1.5 },
        { id: uid("p"), label: "Post", widthIn: 3.5, heightIn: 3.5, x: 2, y: 2 },
        { id: uid("p"), label: "Post", widthIn: 3.5, heightIn: 3.5, x: 90.5, y: 2 },
        { id: uid("p"), label: "Post", widthIn: 3.5, heightIn: 3.5, x: 2, y: 42.5 },
        { id: uid("p"), label: "Post", widthIn: 3.5, heightIn: 3.5, x: 90.5, y: 42.5 },
      ],
    },
    cutKerf: 0.125,
    timeline,
    buildSteps,
    jobInstruction,
    jobBreakdown,
    safety,
  };
}
