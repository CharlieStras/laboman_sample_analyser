<script>
  import { afterUpdate } from "svelte";
  import { processes, samples } from "./store.js";

  export var searchSampleProcess;

  afterUpdate(function selectTheFirstSample() {
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
</script>

{#if $samples && $samples.length > 1}
<table>
  <thead>
    <tr>
      <th>日期</th>
      <th>标本号</th>
    </tr>
  </thead>
  <tbody>
    {#each $samples as {sampleda, sampleno}, index (sampleda + sampleno)}
    <tr on:click="{handleClick}" data-index="{index}">
      <td>{transformSampleDate(sampleda)}</td>
      <td>{sampleno}</td>
    </tr>
    {/each}
  </tbody>
</table>
{/if}

<style>
  tbody tr {
    cursor: pointer;
  }
</style>
