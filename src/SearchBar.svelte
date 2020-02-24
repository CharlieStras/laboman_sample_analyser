<script>
  import {fly, fade} from "svelte/transition";
  import { searched, processes } from "./store";

  export var searchSample;

  var sampleID;
  var inputElement;

  function handleKeydown(event) {
    switch (event.key) {
      case "Enter":
        if (sampleID) {
          searchSample(sampleID);
          sampleID = "";
          inputElement && inputElement.blur();
        }
        break;
      case "Escape":
        sampleID = "";
        inputElement && inputElement.blur();
        break;
      default:
        break;
    }
  }

  function handleClick(event) {
    if (sampleID) {
      searchSample(sampleID);
      sampleID = "";
    }
  }
</script>

<div class="container" class:searched="{$searched}">
  {#if !$searched}
  <input
    type="text"
    placeholder="请输入标本号"
    bind:value="{sampleID}"
    on:keydown="{handleKeydown}"
  />
  <div class="button-container">
    <button on:click="{handleClick}">
      <div class="circle"></div>
      <span></span>
    </button>
  </div>
  {:else}
  <input
    type="text"
    class="searched"
    placeholder="请输入标本号"
    bind:value="{sampleID}"
    bind:this="{inputElement}"
    on:keydown="{handleKeydown}"
  />
  <div class="search" in:fly={{duration: 500, x: 200}}></div>
  {/if}
</div>

<style>
  .container {
    position: relative;
    width: 60%;
  }

  .container.searched {
    position: fixed;
    right: 1.25rem;
    z-index: 2;
  }

  input {
    padding: 1.3125rem;
    width: 100%;
    height: 6.225rem;
    color: #fff;
    border: 0;
    font-size: 2.25rem;
    line-height: 1;
    background-color: #77ca7f;
    border-radius: 0.375rem;
    box-shadow: 0 0.375rem 1.5rem #77cf7f, 0 0 0 0.75rem #ffffff;
  }

  .button-container {
    position: absolute;
    top: 1.3125rem;
    right: 1.3125rem;
  }

  button {
    position: relative;
    display: block;
    width: 3.15rem;
    height: 3.6rem;
    cursor: pointer;
    padding: 0;
    margin: 0;
    border: 0;
    background-color: transparent;
  }

  .circle {
    position: relative;
    top: -0.3rem;
    left: 0;
    width: 2.625rem;
    height: 2.625rem;
    margin-top: 0;
    border-width: 0.5625rem;
    border: 0.5625rem solid #fff;
    background-color: transparent;
    border-radius: 50%;
    transition: 0.5s ease all;
  }

  button span {
    position: absolute;
    top: 2.55rem;
    left: 1.6125rem;
    display: block;
    width: 1.6875rem;
    height: 0.5625rem;
    background-color: transparent;
    border-radius: 0.375rem;
    transform: rotateZ(52deg);
    transition: 0.5s ease all;
  }

  button span:before,
  button span:after {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    width: 1.6875rem;
    height: 0.5625rem;
    background-color: #fff;
    border-radius: 0.375rem;
    transform: rotateZ(0);
    transition: 0.5s ease all;
  }

  .button-container:hover .circle {
    top: -0.0375rem;
    width: 2.5125rem;
    height: 0.5625rem;
    border-width: 0;
    background-color: #fff;
    border-radius: 0.75rem;
  }

  .button-container:hover span {
    top: 50%;
    left: 2.1rem;
    width: 0.9375rem;
    margin-top: -0.3375rem;
    transform: rotateZ(0);
  }

  .button-container:hover span:before {
    bottom: 0.4125rem;
    transform: rotateZ(52deg);
  }

  .button-container:hover span:after {
    bottom: -0.4125rem;
    transform: rotateZ(-52deg);
  }

  .button-container:hover span:before,
  .button-container:hover span:after {
    right: -0.225rem;
    width: 1.5rem;
    background-color: #fff;
  }

  input.searched {
    position: absolute;
    top: 0.9375rem;
    right: 0;
    width: 3.125rem;
    height: 3.125rem;
    border: 0;
    text-shadow: 0 0 0.625rem #77ca7f;
    padding: 0 5rem 0 1.25rem;
    border-radius: 1.875rem;
    box-shadow: 0 0 1.5625rem 0 #77ca7f, 0 1.25rem 1.5625rem 0 rgba(0, 0, 0, 0.2);
    transition: all 1s;
    opacity: 0;
    z-index: 4;
    font-size: 1rem;
    font-weight: bolder;
    letter-spacing: 0.1rem;
  }

  input.searched:hover {
    cursor: pointer;
  }

  input.searched:focus {
    width: 18.75rem;
    opacity: 1;
    cursor: text;
  }

  input::placeholder {
    color: #55a85d;
  }

  input.searched::placeholder {
    color: white;
    opacity: 0.5;
    font-weight: bolder;
  }

  .search {
    position: absolute;
    right: 0;
    width: 80px;
    height: 80px;
    background: #77ca7f;
    border-radius: 50%;
    transition: all 1s;
    box-shadow: 0 0 25px 0 rgba(0, 0, 0, 0.4);
    z-index: 3;
  }

  .search:hover {
    cursor: pointer;
  }

  .search::before {
    content: "";
    position: absolute;
    margin: auto;
    top: 22px;
    right: 0;
    bottom: 0;
    left: 22px;
    width: 12px;
    height: 2px;
    background: white;
    transform: rotate(45deg);
    transition: all 0.5s;
  }

  .search::after {
    content: "";
    position: absolute;
    margin: auto;
    top: -5px;
    right: 0;
    bottom: 0;
    left: -5px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 2px solid white;
    transition: all 0.5s;
  }

  input.searched:focus ~ .search {
    background: #151515;
    z-index: 5;
  }

  input.searched:focus ~ .search::before {
    top: 0;
    left: 0;
    width: 25px;
  }

  input.searched:focus ~ .search::after {
    top: 0;
    left: 0;
    width: 25px;
    height: 2px;
    border: none;
    background: white;
    border-radius: 0%;
    transform: rotate(-45deg);
  }
</style>
