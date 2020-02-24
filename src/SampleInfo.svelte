<script>
  import { sampleInfo } from "./store";
</script>

<section class="sample-info">
  <div class="info">
    <div class="key">标本号:</div>
    <div class="value">{$sampleInfo.sampleID}</div>
  </div>
  {#if $sampleInfo.rackID}
  <div class="info">
    <div class="key">管架号:</div>
    <div class="value">{$sampleInfo.rackID}</div>
  </div>
  {/if} {#if $sampleInfo.tubePosition}
  <div class="info">
    <div class="key">位置号:</div>
    <div class="value">{$sampleInfo.tubePosition}</div>
  </div>
  {/if} {#each $sampleInfo.errors as error (error)}
  <div class="error">{error}</div>
  {/each}
</section>

<style>
  .sample-info {
    position: fixed;
    top: 1.5rem;
    left: 0.5rem;
    z-index: 10;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    background: #023059;
    color: #fff;
    font-size: 1.2rem;
    box-shadow: 1px 1px 1px 1px #ccc;
    line-height: 1.5;
  }

  .info {
    display: flex;
  }

  .key {
    padding-right: 0.3rem;
  }

  .error {
    color: #dc3545;
    font-weight: bold;
  }
</style>
