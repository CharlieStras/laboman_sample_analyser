<script>
  import { afterUpdate } from "svelte";
  import { processes, samples } from "./store.js";

  export var searchSampleProcess;

  var active = true;

  afterUpdate(() => {
    if ($samples.length > 0) {
      // 找第一个标本的流程
      searchSampleProcess(0);
    }
  });

  function transformSampleDate(sampleda) {
    var sampleDate = new Date(sampleda);
    var year = sampleDate.getFullYear();
    var month = sampleDate.getMonth() + 1;
    var day = sampleDate.getDate();

    return `${year}年${month}月${day}日`;
  }

  function handleClick(event) {
    var index = +event.currentTarget.dataset.index;
    searchSampleProcess(index);
  }

  function handleIconClick(event) {
    active = true;
  }

  function handleWindowClick(event) {
    active = false;
  }
</script>

<style>
  section {
    position: fixed;
    top: 7.5rem;
    right: 1.25rem;
    z-index: 2;
  }

  .icon {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
    width: 5rem;
    height: 5rem;
    padding: 1.25rem;
    background: var(--secondary-bg-color);
    box-shadow: 0 0 1.5625rem 0 rgba(0, 0, 0, 0.4);
    border-radius: 100%;
    cursor: pointer;
    transition: opacity 0.6s ease;
    will-change: opacity;
  }

  .icon.hidden {
    opacity: 0;
  }

  svg {
    width: 2.5rem;
    height: 2.5rem;
    fill: #fff;
  }

  table {
    visibility: hidden;
    opacity: 0;
    transform: translate(100%);
    border-collapse: collapse;
    border: 1px solid #eee;
    border-bottom: 2px solid var(--secondary-bg-color);
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.102),
      0px 10px 20px rgba(0, 0, 0, 0.051), 0px 20px 20px rgba(0, 0, 0, 0.051),
      0px 30px 20px rgba(0, 0, 0, 0.051);
    transition: transform 0.6s ease, opacity 0.6s ease;
    will-change: transform;
  }

  table.active {
    transform: unset;
    opacity: 1;
    visibility: unset;
  }

  tbody tr {
    cursor: pointer;
    background: #fff;
  }

  tbody tr:hover {
    background: #f4f4f4;
  }

  th,
  td {
    border: 1px solid #eee;
    padding: 1rem 2rem;
    border-collapse: collapse;
    text-align: center;
  }

  th {
    background: var(--secondary-bg-color);
    color: #fff;
  }

  th:last-child {
    border-right: 0;
  }

  td {
    color: #555;
  }
</style>

<svelte:window on:click={handleWindowClick} />
{#if $samples && $samples.length > 1}
  <section>
    <div
      class="icon"
      class:hidden={active}
      on:click|stopPropagation={handleIconClick}>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 512 512">
        <g>
          <g>
            <path
              d="M18.822,389.655C8.427,389.655,0,398.082,0,408.477v60.522c0,10.395,8.427,18.822,18.822,18.822h216.601v-98.166H18.822z" />
          </g>
        </g>
        <g>
          <g>
            <path
              d="M493.178,389.655H276.937v98.166h216.241c10.395,0,18.822-8.427,18.822-18.822v-60.522
              C512,398.081,503.573,389.655,493.178,389.655z" />
          </g>
        </g>
        <g>
          <g>
            <path
              d="M493.178,249.99H276.937v98.151h216.241c10.395,0,18.822-8.427,18.822-18.822v-60.507
              C512,258.417,503.573,249.99,493.178,249.99z" />
          </g>
        </g>
        <g>
          <g>
            <path
              d="M18.822,249.99C8.427,249.99,0,258.417,0,268.812v60.507c0,10.395,8.427,18.822,18.822,18.822h216.601V249.99H18.822z" />
          </g>
        </g>
        <g>
          <g>
            <path
              d="M493.178,24.179c-15.745,0-451.226,0-474.356,0C8.427,24.179,0,32.606,0,43.001v143.082
              c0,10.395,8.427,18.822,18.822,18.822c20.684,0,453.555,0,474.356,0c10.395,0,18.822-8.427,18.822-18.822V43.001
              C512,32.606,503.573,24.179,493.178,24.179z" />
          </g>
        </g>
      </svg>
    </div>

    <table class:active>
      <thead>
        <tr>
          <th>日期</th>
          <th>标本号</th>
        </tr>
      </thead>
      <tbody>
        {#each $samples as { sampleda, sampleno }, index (sampleda + sampleno)}
          <tr on:click|stopPropagation={handleClick} data-index={index}>
            <td>{transformSampleDate(sampleda)}</td>
            <td>{sampleno}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
{/if}
