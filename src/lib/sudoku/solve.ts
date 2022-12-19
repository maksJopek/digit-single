function solve() {
  let board = self.readBoard(true);
  let backtrack = 0;
  let guesswork = 0;
  let dcount = 0;
  let time = Date.now();
  if (solve()) {
    stats();
    self.writeBytes(board);
    el.classList.add("solved");
  } else {
    stats();
    alert("no solution");
  }
  function solve() {
    let { index, moves, len } = analyze(board);
    if (index == null) return true;
    if (len > 1) guesswork++;
    for (let m = 1; moves; m <<= 1) {
      if (moves & m) {
        dcount++;
        board[index] = m;
        if (solve()) return true;
        moves ^= m;
      }
    }
    board[index] = 0;
    ++backtrack;
    return false;
  }
  function stats() {
    log(el, `${dcount} digits placed<br>${backtrack} take-backs<br>${guesswork} guesses<br>${Date.now() - time} milliseconds`);
  }
}

