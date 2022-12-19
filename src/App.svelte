<script lang="ts">
  import { getNewCoord } from "./lib/helpers";

  import { readGridFromFile, save } from "./lib/Saving";

  import { solve, validate, type Coord } from "./lib/Sudoku";

  let selTile: HTMLDivElement | EventTarget;
  let isImmu = false;
  let selTileCoords: Coord = { x: -1, y: -1 };
  let fileInput: HTMLInputElement;
  const getSelTile = () => selTile as HTMLDivElement;
  let grid = [] as string[][]; //new Array(9).fill(new Array(9).fill("."));
  let solvedGrid = [] as string[][]; //new Array(9).fill(new Array(9).fill("."));
  let immutableTiles = [] as Coord[]; //new Array(9).fill(new Array(9).fill("."));
  const tiles = [] as HTMLDivElement[][]; //new Array(9).fill(new Array(9).fill("."));
  const doneNums = [] as HTMLDivElement[]; //new Array(9).fill(new Array(9).fill("."));
  const doneNumsCount = [] as number[]; //new Array(9).fill(new Array(9).fill("."));
  let hintTime = false;
  let eraseTime = false;

  for (let i = 0; i < 9; i++) {
    grid.push([]);
    tiles.push([]);
    doneNumsCount.push(0);
    for (let j = 0; j < 9; j++) {
      grid[i].push(".");
      // tiles[i].push(null);
    }
  }

  function keyDownHandler(e: KeyboardEvent) {
    const foundImmu = immutableTiles.find(
      (el) => el.x === selTileCoords.x && el.y === selTileCoords.y
    );
    if (foundImmu) isImmu = true;

    let key = e.key;
    key = key === "j" ? "ArrowDown" : key;
    key = key === "k" ? "ArrowUp" : key;
    key = key === "h" ? "ArrowLeft" : key;
    key = key === "l" ? "ArrowRight" : key;
    const t = key.split("Arrow")[1]?.toLowerCase();
    if (["right", "left", "up", "down"].includes(t) && selTile) {
      setSelTile(null, getNewCoord(t, selTileCoords));
    }
    if (isImmu) return;

    let num: string | number = parseInt(e.key);
    if (e.key === "Backspace" || e.key === "d" || eraseTime) {
      setGrid(".", selTileCoords);
      num = ".";
    }
    if (Number.isNaN(num) || selTile == null || num === 0 || eraseTime) return;
    if (hintTime) {
      setHint(num);
      return;
    }

    setGrid(num.toString(), selTileCoords);
    for (const tile of tiles.flat()) {
      tile.classList.remove("err");
      tile.classList.remove("good");
    }
    const bads = validate(grid);
    for (const bad of bads) {
      tiles[bad.x][bad.y].classList.add("err");
    }
  }
  function setSelTile(
    nst: HTMLDivElement | EventTarget | null,
    x: number | Coord,
    y?: number
  ) {
    if (selTile) getSelTile().classList.remove("selected");
    if (typeof x === "object") {
      y = x.y;
      x = x.x;
    }
    if (y == undefined) throw new Error("y is undefinedly!");

    if (nst) selTile = nst;
    else selTile = tiles[x][y];
    selTileCoords = { x, y };
    if (eraseTime) setGrid(".", selTileCoords);
    getSelTile().classList.add("selected");
  }

  async function load() {
    const fs = fileInput.files;
    const maybeGrid = await readGridFromFile(fs ? fs[0] : undefined);
    fileInput.value = "";
    if (!maybeGrid) {
      alert("Error while loading file");
      return;
    }
    for (const [i, row] of maybeGrid.entries()) {
      for (const [j, tile] of row.entries()) {
        if (tile === ".") continue;
        immutableTiles.push({ x: i, y: j });
        tiles[i][j].classList.add("const");
      }
    }
    if (validate(maybeGrid).length > 0) {
      alert("Can not load grid, not valid");
      return;
    }
    grid = maybeGrid;
    solvedGrid = solve(grid);
  }

  function setGrid(val: string, ax: number | Coord, ay?: number) {
    let x = -1,
      y = -1;
    if (typeof ax === "object") [x, y] = [ax.x, ax.y];
    else if (ay != null) [x, y] = [ax, ay];
    else throw new Error("setGrid() didnt get any good arguments");

    const oldNum = grid[x][y];
    grid[x][y] = val;

    if (oldNum !== ".") doneNumsCount[parseInt(oldNum) - 1]--;
    if (val !== ".") doneNumsCount[parseInt(val) - 1]++;
    // else getSelTile().classList.remove("wrong", "good", "err");

    if (solvedGrid.length > 0) {
      if (grid[x][y] !== solvedGrid[x][y]) getSelTile().classList.add("wrong");
      else getSelTile().classList.add("good");
    }
    // if (typeof x === "object") grid[x.x][x.y] = val;
    // else if (y != null) grid[x][y] = val;
    // else throw new Error("setGrid() didnt get any good arguments");
  }
  function setHint(num: number | string) {
    const t = getSelTile();
    // debugger;
    const c = t.querySelector(`.hint-${num}`);
    if (!c) return;
    const cih = c.innerHTML;
    if (cih === "") c.innerHTML = num.toString();
    else c.innerHTML = "";
  }

  function solveGrid() {
    if (validate(grid).length > 0) {
      alert("Grid is not valid, can not solve");
      return;
    }
    grid = solve(grid);
    for (let i = 0; i < doneNumsCount.length; i++) doneNumsCount[i] = 9;
  }
</script>

<!-- <svelte:body on:keydown|preventDefault|stopPropagation={keyDownHandler} /> -->
<svelte:body on:keydown={keyDownHandler} />
<main>
  <div class="left">
    <input type="file" on:change={load} bind:this={fileInput} />
    <button on:click={() => save(grid)}>Save</button>
  </div>
  <div class="grid">
    {#each grid as row, i}
      {#each row as tile, j}
        <div
          class="tile"
          class:br={j % 3 === 2 && j !== 8}
          class:bb={i % 3 === 2 && i !== 8}
          on:click|self={(e) => setSelTile(e.target, i, j)}
          data-i={i}
          data-j={j}
          bind:this={tiles[i][j]}
          on:keypress={null}
        >
          {tile === "." ? "" : tile}
          <span class="hint hint-1" />
          <span class="hint hint-2" />
          <span class="hint hint-3" />
          <span class="hint hint-4" />
          <span class="hint hint-5" />
          <span class="hint hint-6" />
          <span class="hint hint-7" />
          <span class="hint hint-8" />
          <span class="hint hint-9" />
        </div>
      {/each}
    {/each}
  </div>
  <div class="right" class:err={false}>
    <button class="btn-solve" on:click={solveGrid}>Solve</button>
    <div>
      <label>
        Hint:
        <input type="checkbox" bind:checked={hintTime} />
      </label>
      <label>
        Erase:
        <input type="checkbox" bind:checked={eraseTime} />
      </label>
      <div class="small-grid">
        {#each { length: 9 } as _, i}
          <div bind:this={doneNums[i]} class:done={doneNumsCount[i] === 9}>
            {i + 1}
          </div>
        {/each}
      </div>
    </div>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  @media screen and (max-width: 1144px) {
    main {
      flex-direction: column;
    }
    .left {
      min-height: 10rem;
      align-items: center !important;
    }
    .right {
      padding-top: 2rem;
    }
  }
  .left {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 2rem;
    flex-direction: column;
    padding-right: 3rem;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
  }
  .tile {
    width: 4rem;
    aspect-ratio: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2.5rem;
    gap: 0;
    box-sizing: border-box;
    user-select: none;
    position: relative;
  }
  .hint {
    font-size: 0.6rem;
    position: absolute;
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-left: 3rem;
    gap: 2rem;
  }
  .right > div {
    display: flex;
    flex-direction: column;
  }
  .btn-solve {
    background-color: #ff000000;
    border: 3px solid white;
    color: white;
    font-size: 1.5rem;
  }
  .small-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-top: 2rem;
  }
  .small-grid > div {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    width: 2rem;
    line-height: 2rem;
    padding: 0.8rem;
    background-color: #aaaaaa;
  }
  .small-grid > div.done {
    background-color: #00aaaa;
  }
  .tile:nth-child(odd) {
    background-color: lightgrey;
  }
  .tile:nth-child(even) {
    background-color: wheat;
  }
  .bb {
    border-bottom: 3px solid black;
  }
  .br {
    border-right: 3px solid black;
  }
  .err:nth-child(n) {
    background-color: rgba(150, 0, 0, 0.6);
  }
  :global(.const) {
    color: rebeccapurple;
  }
  :global(.wrong) {
    color: #dd0000;
  }
  :global(.good) {
    color: #00dd00;
  }
  @keyframes blink-animation {
    0% {
      background-color: revert;
    }
    50% {
      background-color: pink;
    }
    100% {
      background-color: revert;
    }
  }
  :global(.selected) {
    animation: blink-animation 5s ease-in-out infinite;
  }
  @media print {
    .left,
    .right {
      display: none;
    }
    .tile {
      width: 5rem;
      /* border: 1px solid black; */
      print-color-adjust: exact;
    }
    :global(.selected) {
      animation: none;
    }
  }
</style>
