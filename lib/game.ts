export type Cell = {
  value: number;
  id: string;
  mergedFrom?: Cell[];
};

export type Direction = "up" | "down" | "left" | "right";
export type Vector = { x: number; y: number };

export const GRID_SIZE = 4;

export const VECTORS: Record<Direction, Vector> = {
  up: { x: -1, y: 0 },
  down: { x: 1, y: 0 },
  left: { x: 0, y: -1 },
  right: { x: 0, y: 1 },
};

export function generateRandomCell(cells: Cell[][]): { row: number; col: number; value: number } | null {
  const emptyCells: { row: number; col: number }[] = [];
  
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (!cells[i][j]) {
        emptyCells.push({ row: i, col: j });
      }
    }
  }

  if (emptyCells.length === 0) return null;

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  return {
    ...randomCell,
    value: Math.random() < 0.9 ? 2 : 4,
  };
}

export function canMove(grid: Cell[][]): boolean {
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (!grid[x][y]) return true;
      
      const value = grid[x][y].value;
      const neighbors = [
        { x: x - 1, y },
        { x: x + 1, y },
        { x, y: y - 1 },
        { x, y: y + 1 },
      ];

      for (const neighbor of neighbors) {
        if (
          neighbor.x >= 0 && neighbor.x < GRID_SIZE &&
          neighbor.y >= 0 && neighbor.y < GRID_SIZE &&
          grid[neighbor.x][neighbor.y]?.value === value
        ) {
          return true;
        }
      }
    }
  }
  return false;
}