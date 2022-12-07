import sudoku from "sudoku-umd";

type Grid = Array<Array<string>>;

export function validate(grid: Grid) {
  const list = sudoku.board_grid_to_string(grid)

  return true
}
