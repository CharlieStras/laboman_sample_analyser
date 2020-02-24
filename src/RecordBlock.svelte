<script>
  import { onMount } from "svelte";

  import RecordIcon from "./RecordIcon.svelte";
  import RecordPad from "./RecordPad.svelte";

  export var record;
  var blockRef = null;
  var hidden = false;
  var bounce = false;
  var scrolling = false;

  onMount(function setHidden() {
    if (blockRef.getBoundingClientRect().top > window.innerHeight * 0.9) {
      hidden = true;
    }
  });

  function handleScroll() {
    if (!scrolling) {
      scrolling = true;
      !window.requestAnimationFrame
        ? setTimeout(checkTimelineScroll, 250)
        : window.requestAnimationFrame(checkTimelineScroll);
    }
  }

  function checkTimelineScroll() {
    if (
      hidden &&
      blockRef.getBoundingClientRect().top <= window.innerHeight * 0.9
    ) {
      hidden = false;
      bounce = true;
    }
    scrolling = false;
  }
</script>

<svelte:window on:scroll="{handleScroll}"></svelte:window>

<div class="record-block" bind:this="{blockRef}">
  <div class="text-container" class:hidden class:bounce>
    <RecordPad title="{record.title}" content="{record.content}"></RecordPad>
  </div>
  <RecordIcon
    iconName="{record.iconName}"
    iconType="{record.iconType}"
    status="{record.status}"
    {hidden}
    {bounce}
  ></RecordIcon>
  <div class="time" class:hidden>{record.recordTime}</div>
</div>

<style>
  .record-block {
    display: flex;
    position: relative;
    z-index: 1;
    margin-bottom: 3.125rem;
  }

  .record-block:last-child {
    margin-bottom: 0;
  }

  .text-container {
    position: relative;
  }

  .text-container::before {
    content: "";
    position: absolute;
    top: 1rem;
    right: 100%;
    width: 0;
    height: 0;
    border: 0.4375rem solid transparent;
    border-right-color: hsl(0, 0%, 100%);
  }

  .time {
    color: hsla(207, 10%, 55%, 0.7);
  }

  @media (min-width: 40rem) {
    .record-block:nth-child(even) {
      flex-direction: row-reverse;
    }

    .text-container {
      display: flex;
      flex-basis: calc(50% - 3.075rem);
      will-change: transform;
    }

    .text-container::before {
      top: 1.5rem;
    }

    .text-container.hidden {
      visibility: hidden;
    }

    .text-container.bounce {
      animation: bounce 0.6s;
    }

    .time {
      display: flex;
      flex-basis: calc(50% - 3.075rem);
      margin-left: -0.4375rem;
      padding-top: 1.2rem;
    }

    .time.hidden {
      visibility: hidden;
    }

    .record-block:nth-child(odd) .text-container {
      justify-content: flex-end;
    }

    .record-block:nth-child(odd) .text-container::before {
      left: 100%;
      right: unset;
      border-right-color: transparent;
      border-left-color: hsl(0, 0%, 100%);
    }

    .record-block:nth-child(even) .time {
      justify-content: flex-end;
      margin-right: -0.4375rem;
    }

    .record-block:nth-child(even) .text-container.bounce {
      animation: bounce-inverse 0.6s;
    }
  }

  @keyframes bounce {
    0% {
      opacity: 0;
      transform: translateX(-6rem);
    }

    60% {
      opacity: 1;
      transform: translateX(0.5rem);
    }

    100% {
      transform: translateX(0);
    }
  }

  @keyframes bounce-inverse {
    0% {
      opacity: 0;
      transform: translateX(6rem);
    }

    60% {
      opacity: 1;
      transform: translateX(-0.5rem);
    }

    100% {
      transform: translateX(0);
    }
  }
</style>
