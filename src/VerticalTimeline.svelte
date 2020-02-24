<script>
  import { fade } from "svelte/transition";

  import RecordBlock from "./RecordBlock.svelte";

  export var processes;
</script>

<div class="vertical-timeline" in:fade>
  {#each processes as record (record)}
  <RecordBlock {record}></RecordBlock>
  {/each}
</div>

<style>
  .vertical-timeline {
    position: relative;
    padding: 4rem 0;
    color: hsl(207, 10%, 55%);
    background-color: hsl(205, 38%, 93%);
  }

  .vertical-timeline::before {
    content: "";
    position: absolute;
    top: 2rem;
    left: 1.125rem;
    height: calc(100% - 4rem);
    width: 0.25rem;
    background: hsl(205, 38%, 89%);
  }

  @media (min-width: 640px) {
    .vertical-timeline::before {
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
