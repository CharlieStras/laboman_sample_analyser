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
  <div class="search" in:fly={{duration: 1000, x: 200}}></div>
  {/if}
</div>

<style>
  .container {
    width: 100%;
    position: relative;
    transform: scale(0.6);
  }

  .container.searched {
    position: fixed;
    right: 20px;
    transform: none;
    z-index: 2;
  }

  input {
    margin: 0;
    padding: 35px;
    width: 100%;
    height: 166px;
    color: #fff;
    border: 0;
    font-size: 60px;
    line-height: 1;
    background-color: #77ca7f;
    border-radius: 10px;
    box-shadow: 0 10px 40px #77cf7f, 0 0 0 20px #ffffff;
  }

  input.searched {
    position: absolute;
    top: 15px;
    right: 0;
    width: 50px;
    height: 50px;
    border: none;
    text-shadow: 0 0 10px #77ca7f;
    padding: 0 80px 0 20px;
    border-radius: 30px;
    box-shadow: 0 0 25px 0 #77ca7f, 0 20px 25px 0 rgba(0, 0, 0, 0.2);
    transition: all 1s;
    opacity: 0;
    z-index: 4;
    font-size: 1rem;
    font-weight: bolder;
    letter-spacing: 0.1em;
  }

  input.searched:hover {
    cursor: pointer;
  }

  input.searched:focus {
    width: 300px;
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

  .button-container {
    position: absolute;
    top: 35px;
    right: 35px;
  }

  button {
    position: relative;
    display: block;
    width: 84px;
    height: 96px;
    cursor: pointer;
    padding: 0;
    margin: 0;
    border: 0;
    background-color: transparent;
  }

  .circle {
    position: relative;
    top: -8px;
    left: 0;
    width: 70px;
    height: 70px;
    margin-top: 0;
    border-width: 15px;
    border: 15px solid #fff;
    background-color: transparent;
    border-radius: 50%;
    transition: 0.5s ease all;
  }

  button span {
    position: absolute;
    top: 68px;
    left: 43px;
    display: block;
    width: 45px;
    height: 15px;
    background-color: transparent;
    border-radius: 10px;
    transform: rotateZ(52deg);
    transition: 0.5s ease all;
  }

  button span:before,
  button span:after {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    width: 45px;
    height: 15px;
    background-color: #fff;
    border-radius: 10px;
    transform: rotateZ(0);
    transition: 0.5s ease all;
  }

  .button-container:hover .circle {
    top: -1px;
    width: 67px;
    height: 15px;
    border-width: 0;
    background-color: #fff;
    border-radius: 20px;
  }

  .button-container:hover span {
    top: 50%;
    left: 56px;
    width: 25px;
    margin-top: -9px;
    transform: rotateZ(0);
  }

  .button-container:hover span:before {
    bottom: 11px;
    transform: rotateZ(52deg);
  }

  .button-container:hover span:after {
    bottom: -11px;
    transform: rotateZ(-52deg);
  }

  .button-container:hover span:before,
  .button-container:hover span:after {
    right: -6px;
    width: 40px;
    background-color: #fff;
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
