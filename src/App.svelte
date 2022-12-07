<script lang="ts">
  import { validate } from "./lib/Sudoku";

  let selTile: HTMLDivElement | EventTarget;
  const getSelTile = () => selTile as HTMLDivElement;
  const grid = (new Array(10)).fill((new Array(10)).fill(".")) as string[][];

  function keyDownHandler(e: KeyboardEvent) {
    if(e.key === "Backspace") {
      setSelTile(".")
    }
    const num = parseInt(e.key);
    if(Number.isNaN(num) || num === 0) return;
    setSelTile(num)
    validate(grid)
  }
  function showTile(val: string) {
    return val === "." ? "" : val;
  }
  function setSelTile(val: string | number) {
    grid[parseInt(getSelTile().dataset.i)][parseInt(getSelTile().dataset.j)] = val.toString();
    getSelTile().innerText = val === "." ? "" : val.toString();
  }
</script>

<!-- <svelte:body on:keydown|preventDefaultstopPropagation={keyDownHandler} /> -->
<svelte:body on:keydown={keyDownHandler} />
<main>
  <div class="grid">
    {#each {length: 9} as _, i}
      {#each {length: 9} as _, j}
        <div 
          class="tile" 
          class:br={j % 3 === 2 && j !== 8}
          class:bb={i % 3 === 2 && i !== 8}
          on:click|self={e => selTile = e.target}
          data-i={i}
          data-j={j}
          on:keypress={null}>{grid[i][j] === "." ? "" : grid[i][j]}</div>
      {/each}
    {/each}
  </div>
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
</style>
