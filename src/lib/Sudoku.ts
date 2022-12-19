//@ts-expect-error
import _sudoku from "sudoku-umd";
//@ts-expect-error
import _sudoku2_ from "sudoku-solver-js";

const _sudoku2 = new _sudoku2_();

const sudoku: {
  solve(arg0: string): string,
  board_string_to_grid(arg0: string): string[][],
  board_grid_to_string(arg0: string[][]): string,
  get_candidates(arg0: string): string[][],
  print_board(arg0: string): void,
} = _sudoku;

export type Grid = Array<Array<string>>;
export type NGrid = Array<Array<number>>;
export type Coord = { x: number; y: number };
export * from "./sudoku/validation";

export function solve(grid: Grid) {
  return sudoku.board_string_to_grid(_sudoku2.solve(sudoku.board_grid_to_string(grid)))
}
// function grid2NGrid(grid: Grid): NGrid {
//   return grid.map(
//     row => row.map(t => t === "." ? 0 : parseInt(t))
//   )
// }
// function ngrid2Grid(ngrid: NGrid): Grid {
//   return ngrid.map(
//     row => row.map(t => t === 0 ? "." : t.toString())
//   )
// }
