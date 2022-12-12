import type { Grid } from "./Sudoku";

export function save(grid: Grid) {
  const a = document.createElement("a");
  const fileParts = [JSON.stringify(grid)];
  const blob = new Blob(fileParts, { type: 'application/json' }); // the blob
  a.href = URL.createObjectURL(blob);
  a.download = "sudoku-save.json";
  a.click();
}
export function readGridFromFile(f: File): Promise<string[][] | null> {
  return new Promise(res => {
    let reader = new FileReader();
    reader.onload = e => {
      try {
        //@ts-expect-error
        const json = JSON.parse(e.target.result);
        res(json)
      } catch (error) {
        res(null)
      }
    };
    reader.readAsText(f);
  })
}
