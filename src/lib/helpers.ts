import type { Coord } from "./Sudoku";

export function getNewCoord(direction: string, curCoords: Coord) {
  let { x, y } = curCoords;
  if (direction === "up")
    x === 0 ? x = 8 : x--;
  else if (direction === "down")
    x === 8 ? x = 0 : x++;
  else if (direction === "right")
    y === 8 ? y = 0 : y++;
  else if (direction === "left")
    y === 0 ? y = 8 : y--;
  else
    throw new Error("getNewCoord(): bad direction")
  return { x, y }
}
