<script>
  import { onMount, afterUpdate } from "svelte";
  import { fade } from "svelte/transition";

  import { needInit } from "./store";

  import SampleNode from "./SampleNode.svelte";
  import ProcessIcon from "./ProcessIcon.svelte";

  export var processes;

  var scrolling = false;

  onMount(initialization);
  afterUpdate(function checkIfNeedInit() {
    if ($needInit) {
      initialization();
    }
  });

  function initialization() {
    processes.forEach(function hideContent(process) {
      if (
        process.blockRef.getBoundingClientRect().top >
        window.innerHeight * 0.9
      ) {
        process.hide = true;
      }
    });
    processes = processes;
    needInit.set(false);
  }

  function handleScroll() {
    if (!scrolling) {
      scrolling = true;
      !window.requestAnimationFrame
        ? setTimeout(checkTimelineScroll, 250)
        : window.requestAnimationFrame(checkTimelineScroll);
    }
  }

  function checkTimelineScroll() {
    processes.forEach(function showProcess(process) {
      if (
        process.hide &&
        process.blockRef.getBoundingClientRect().top <= window.innerHeight * 0.9
      ) {
        process.hide = false;
        process.bounceIn = true;
      }
    });
    processes = processes;
    scrolling = false;
  }
</script>

<svelte:window on:scroll="{handleScroll}"></svelte:window>

<section class="vertical-timeline" transition:fade>
  <div class="container">
    {#each processes as process}
    <div class="block" bind:this="{process.blockRef}">
      <ProcessIcon
        iconName="{process.iconName}"
        iconType="{process.iconType}"
        hide="{process.hide}"
        bounceIn="{process.bounceIn}"
        status="{process.status}"
      ></ProcessIcon>

      <div
        class="content"
        class:content-hidden="{process.hide}"
        class:content-bounce-in="{process.bounceIn}"
      >
        <SampleNode {...process.content}></SampleNode>
        <div class="time-container">
          <span class="time">{process.time}</span>
        </div>
      </div>
    </div>
    {/each}
  </div>
</section>

<style>
  .vertical-timeline {
    overflow: hidden;
    padding: 50px 0;
    color: var(--cd-color-3);
    background-color: hsl(205, 38%, 93%);
  }

  .vertical-timeline h2 {
    font-weight: 700;
  }

  .container {
    position: relative;
    padding: 30px 0;
  }

  .container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 18px;
    height: 100%;
    width: 4px;
    background: var(--cd-color-2);
  }

  @media (min-width: 640px) {
    .container::before {
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .block {
    display: flex;
    position: relative;
    z-index: 1;
    margin-bottom: 50px;
  }

  .block:last-child {
    margin-bottom: 0;
  }

  @media (min-width: 640px) {
    .block:nth-child(even) {
      flex-direction: row-reverse;
    }
  }

  .content {
    flex-grow: 1;
    position: relative;
    margin-left: 20px;
  }

  .content::before {
    content: "";
    position: absolute;
    top: 16px;
    right: 100%;
    width: 0;
    height: 0;
    border: 7px solid transparent;
    border-right-color: hsl(0, 0%, 100%);
  }

  @media (min-width: 640px) {
    .content {
      width: calc((100% - 110px) / 2);
      flex-grow: 0;
      will-change: transform;
      margin: 0;
    }

    .content::before {
      top: 24px;
    }

    .block:nth-child(odd) .content {
      text-align: right;
    }

    .block:nth-child(odd) .content::before {
      right: auto;
      left: 100%;
      border-right-color: transparent;
      border-left-color: hsl(0, 0%, 100%);
    }
  }

  .time-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .time {
    text-align: left;
    color: hsla(207, 10%, 55%, 0.7);
  }

  @media (min-width: 640px) {
    .time {
      position: absolute;
      width: 100%;
      left: calc(100% + 100px);
      top: 20px;
    }

    .block:nth-child(even) .time {
      left: auto;
      right: calc(100% + 100px);
      text-align: right;
    }
  }

  @media (min-width: 640px) {
    .content-hidden {
      visibility: hidden;
    }

    .content-bounce-in {
      animation: cd-bounce-2 0.6s;
    }

    .block:nth-child(even) .content-bounce-in {
      animation-name: cd-bounce-2-inverse;
    }
  }

  @keyframes cd-bounce-2 {
    0% {
      opacity: 0;
      transform: translateX(-100px);
    }

    60% {
      opacity: 1;
      transform: translateX(10px);
    }

    100% {
      transform: translateX(0);
    }
  }

  @keyframes cd-bounce-2-inverse {
    0% {
      opacity: 0;
      transform: translateX(100px);
    }

    60% {
      opacity: 1;
      transform: translateX(-10px);
    }

    100% {
      transform: translateX(0);
    }
  }
</style>
