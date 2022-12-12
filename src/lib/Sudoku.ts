export type Grid = Array<Array<string>>;
export type Coord = { x: number; y: number };

export function validate(board: Grid) {
  const bads = [] as Coord[];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const value = board[i][j];
      if (value !== '.') {
        if (!validateRow(board, i, j, value) || !validateColumn(board, i, j, value) || !validateBox(board, i, j, value)) {
          bads.push({ x: i, y: j })
        }
      }
    }
  }
  return bads;
};

function validateRow(board: Grid, row: number, col: number, value: string) {
  for (let j = 0; j < 8; j++) {
    if (j !== col) {
      if (board[row][j] === value) {
        return false;
      }
    }
  }

  return true;
}

function validateColumn(board: Grid, row: number, col: number, value: string) {
  for (let i = 0; i < 8; i++) {
    if (i !== row) {
      if (board[i][col] === value) {
        return false;
      }
    }
  }

  return true;
}

function validateBox(board: Grid, row: number, col: number, value: string) {
  const startRow = row - (row % 3), startCol = col - (col % 3);

  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (i !== row && j !== col) {
        if (board[i][j] === value) {
          return false;
        }
      }
    }
  }

  return true;
}
