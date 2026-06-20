import type { CutRequirement, Project } from "./types";
import { uid } from "./utils";

// Actual (dressed) lumber widths for common nominal boards, in inches.
const NOMINAL_TO_ACTUAL: Record<number, number> = {
  4: 3.5, // 2x4
  6: 5.5, // 2x6
  8: 7.25, // 2x8
  10: 9.25,
  12: 11.25,
};

function measure(project: Project, labelIncludes: string, fallback: number): number {
  const m = project.measurements.find((x) =>
    x.label.toLowerCase().includes(labelIncludes.toLowerCase())
  );
  return m ? m.value : fallback;
}

/** Parse the actual board face-width from a spec like "2x6x8 pt" -> 5.5". */
function wallBoardWidth(spec: string): number {
  const match = spec.match(/2x(\d+)/i);
  const nominal = match ? parseInt(match[1], 10) : 6;
  return NOMINAL_TO_ACTUAL[nominal] ?? 5.5;
}

/**
 * Derive a concrete cut list for the currently selected tier. The number of
 * wall courses is computed from the target bed height and the chosen board's
 * actual width, so the cut plan responds to both measurements and material tier.
 */
export function deriveCuts(project: Project): {
  requirements: CutRequirement[];
  stockLength: number;
  courses: number;
} {
  const option = project.options.find((o) => o.tier === project.selectedTier)!;
  const wall = option.materials.find((m) => m.category === "lumber" && /wall/i.test(m.name));
  const post = option.materials.find((m) => m.category === "lumber" && /post/i.test(m.name));

  const stockLength = wall?.unitLengthIn ?? 96;
  const boardWidth = wallBoardWidth(wall?.spec ?? "2x6");

  const bedLength = measure(project, "length", 96);
  const bedWidth = measure(project, "width", 48);
  const bedHeight = measure(project, "height", 16);
  const thickness = measure(project, "thickness", 1.5);

  const courses = Math.max(1, Math.round(bedHeight / boardWidth));
  const endWallLength = Math.max(1, bedWidth - thickness * 2);
  const wallMaterialId = wall?.id ?? "wall";
  const postMaterialId = post?.id ?? "post";

  const requirements: CutRequirement[] = [
    {
      id: uid("cut"),
      label: `Long wall (${bedLength}")`,
      length: bedLength,
      quantity: 2 * courses,
      stockLength,
      materialId: wallMaterialId,
    },
    {
      id: uid("cut"),
      label: `End wall (${endWallLength}")`,
      length: endWallLength,
      quantity: 2 * courses,
      stockLength,
      materialId: wallMaterialId,
    },
    {
      id: uid("cut"),
      label: `Corner post (${bedHeight}")`,
      length: bedHeight,
      quantity: 4,
      stockLength: post?.unitLengthIn ?? stockLength,
      materialId: postMaterialId,
    },
  ];

  return { requirements, stockLength, courses };
}
