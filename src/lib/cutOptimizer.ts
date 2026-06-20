import type { CutPlan, CutRequirement, StockUsage } from "./types";

// ---------------------------------------------------------------------------
// The "obsessive" cut optimizer.
//
// This solves a 1-D cutting-stock / bin-packing problem: given a list of
// required cut lengths and a stock board length, lay the cuts onto as few
// boards as possible while accounting for the saw KERF (material lost to the
// blade on every cut). We use First-Fit-Decreasing (FFD) — a fast, near
// optimal heuristic — and track waste per board so the UI can be obsessive
// about every last inch.
//
// Kerf model: every cut consumes `kerf` inches. A board that receives N cut
// pieces needs N kerfs in the general case (the final trim still loses blade
// width). We charge one kerf per piece placed, which is conservative and
// matches how a careful builder plans real cuts.
// ---------------------------------------------------------------------------

export interface OptimizeInput {
  requirements: CutRequirement[];
  stockLength: number;
  kerf: number;
}

interface Piece {
  label: string;
  length: number;
}

export function optimizeCuts({
  requirements,
  stockLength,
  kerf,
}: OptimizeInput): CutPlan {
  // Expand requirements (quantity) into individual pieces.
  const pieces: Piece[] = [];
  for (const req of requirements) {
    for (let i = 0; i < req.quantity; i++) {
      pieces.push({ label: req.label, length: req.length });
    }
  }

  // First-Fit-Decreasing: sort longest-first so big pieces seat first.
  pieces.sort((a, b) => b.length - a.length);

  const boards: StockUsage[] = [];

  for (const piece of pieces) {
    const need = piece.length + kerf;
    // Try to fit into an existing board with remaining room.
    let placed = false;
    for (const board of boards) {
      const remaining = board.stockLength - board.usedLength;
      if (remaining >= need) {
        board.cuts.push({ label: piece.label, length: piece.length });
        board.usedLength += need;
        placed = true;
        break;
      }
    }
    if (!placed) {
      boards.push({
        stockIndex: boards.length,
        stockLength,
        cuts: [{ label: piece.label, length: piece.length }],
        usedLength: need,
        wasteLength: 0,
      });
    }
  }

  // Finalize waste per board.
  let totalWaste = 0;
  for (const board of boards) {
    board.wasteLength = Math.max(0, board.stockLength - board.usedLength);
    totalWaste += board.wasteLength;
  }

  const totalStock = boards.length * stockLength;
  const usedMaterial = totalStock - totalWaste;
  const efficiency = totalStock === 0 ? 0 : usedMaterial / totalStock;

  return {
    kerf,
    stockLength,
    boardsNeeded: boards.length,
    boards,
    totalWaste,
    totalStock,
    efficiency,
  };
}

/** Naive plan: one board per cut piece — used to show how much the optimizer saves. */
export function naiveBoardCount(requirements: CutRequirement[]): number {
  return requirements.reduce((sum, r) => sum + r.quantity, 0);
}
