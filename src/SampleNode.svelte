<script>
  export var title;
  export var serialNO;
  export var rackID;
  export var tubePosition;
  export var item;
  export var area;
  export var sortingIndex;
  export var trayNO;
  export var positionInRack;
  export var lisNO;
</script>

<div class="content-text">
  <h3>{title}</h3>
  {#if serialNO}
  <div>机身号: {serialNO}</div>
  {/if} {#if rackID}
  <div>管架号: {rackID}，位置号: {tubePosition}</div>
  {/if} {#if item}
  <div>指令内容: {item}</div>
  {/if} {#if area}
  <div>主机指定的归档区域: {area}</div>
  {/if} {#if sortingIndex}
  <div>
    归档区域: {sortingIndex}，托盘序号: {trayNO}，位置: {positionInRack}
  </div>
  {/if} {#if lisNO}
  <div>LIS短号: {lisNO}</div>
  {/if}
</div>

<style>
  .content-text {
    display: inline-block;
    padding: 20px;
    background: hsl(0, 0%, 100%);
    border-radius: 0.25em;
    box-shadow: 0 3px 0 var(--cd-color-2);
    text-align: left;
  }

  .content-text h3 {
    margin-top: 0;
    margin-bottom: 10px;
  }

  .content-text div {
    margin: 5px 0;
  }
</style>
