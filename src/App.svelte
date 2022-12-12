<script lang="ts">
  import { readGridFromFile, save } from "./lib/Saving";

  import { validate, type Coord } from "./lib/Sudoku";

  let selTile: HTMLDivElement | EventTarget;
  let fileInput: HTMLInputElement;
  const getSelTile = () => selTile as HTMLDivElement;
  const getCoord = (): Coord => ({
    x: parseInt(getSelTile().dataset.i),
    y: parseInt(getSelTile().dataset.j),
  });
  let grid = [] as string[][]; //new Array(9).fill(new Array(9).fill("."));
  let immutableTiles = [] as Coord[]; //new Array(9).fill(new Array(9).fill("."));
  const tiles = [] as HTMLDivElement[][]; //new Array(9).fill(new Array(9).fill("."));
  for (let i = 0; i < 9; i++) {
    grid.push([]);
    tiles.push([]);
    for (let j = 0; j < 9; j++) {
      grid[i].push(".");
      tiles[i].push(null);
    }
  }

  function keyDownHandler(e: KeyboardEvent) {
    const foundImmu = immutableTiles.find(
      (el) => el.x === getCoord().x && el.y === getCoord().y
    );
    console.log(immutableTiles);
    console.log(foundImmu);
    if (foundImmu) return;

    if (e.key === "Backspace") {
      setSelTile(".");
    }
    const num = parseInt(e.key);
    if (Number.isNaN(num) || selTile == null || num === 0) return;
    setSelTile(num);
    for (const tile of tiles.flat()) {
      tile.classList.remove("err");
      tile.classList.remove("good");
    }
    const bads = validate(grid);
    for (const bad of bads) {
      tiles[bad.x][bad.y].classList.add("err");
    }
  }
  // function showTile(val: string) {
  //   return val === "." ? "" : val;
  // }
  function setSelTile(val: string | number) {
    grid[getCoord().x][getCoord().y] = val.toString();
    // getSelTile().innerText = val === "." ? "" : val.toString();
  }

  async function load() {
    const maybeGrid = await readGridFromFile(fileInput.files[0]);
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
    grid = maybeGrid;
    fileInput.value = null;
  }
</script>

<!-- <svelte:body on:keydown|preventDefault|stopPropagation={keyDownHandler} /> -->
<svelte:body on:keydown={keyDownHandler} />
<main>
  <div class="grid">
    {#each grid as row, i}
      {#each row as tile, j}
        <div
          class="tile"
          class:br={j % 3 === 2 && j !== 8}
          class:bb={i % 3 === 2 && i !== 8}
          on:click|self={(e) => (selTile = e.target)}
          data-i={i}
          data-j={j}
          bind:this={tiles[i][j]}
          on:keypress={null}
        >
          {tile === "." ? "" : tile}
        </div>
      {/each}
    {/each}
  </div>
  <button on:click={() => save(grid)}>Save</button>
  <input type="file" on:change={load} bind:this={fileInput} />
</main>

<style>
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
  :global(.err) {
    background-color: rgba(150, 0, 0, 0.6) !important;
  }
  :global(.const) {
    color: rebeccapurple;
  }
</style>
