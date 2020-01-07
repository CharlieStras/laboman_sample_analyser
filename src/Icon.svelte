<script>
  export var name;
  export var fill;
  export var hide;
  export var bounceIn;
  export var type;
</script>

<svg
  data-name="icon"
  xmlns="http://www.w3.org/2000/svg"
  width="45px"
  height="45px"
  {fill}
  viewBox="0 0 32 32"
  class:hidden="{hide}"
  class:bounce-in="{bounceIn}"
>
  {#if name == "LIS"}
  <g class="icon-lis">
    <path
      d="M25.6,14.25V4.12A1.6,1.6,0,0,0,24,2.52H8a1.6,1.6,0,0,0-1.6,1.6V14.25H5.34v1.6a1.59,1.59,0,0,0,1.59,1.6H25.07a1.59,1.59,0,0,0,1.59-1.6v-1.6ZM7.47,4.12A.53.53,0,0,1,8,3.59H24a.53.53,0,0,1,.53.53V14.25H7.47ZM25.6,15.85a.54.54,0,0,1-.53.54H6.93a.54.54,0,0,1-.53-.54v-.53H25.6Z"
    />
    <path d="M8,13.72H24V4.12H8ZM9.07,5.19H22.93v7.46H9.07Z" />
  </g>
  {:else if name == "TS"}
  <path
    class="icon-ts"
    d="M25.65,11.86V3.48c0-.53-.7-1-1.56-1H8.83c-.88,0-1.56.43-1.56,1v8.38H5.57v5.59H27.33V11.86Zm-7.18,0h-4v-1.8h4Zm5.62,0h-4v-1.8h4ZM8.83,3.48H24.09V9.11H8.83Zm0,6.58h4v1.8h-4Zm17,6.55H7V12.82H25.87Z"
  />
  {:else if name == "CT"}
  <g class="icon-ct">
    <defs>
      <style>
        .cls-1 {
          fill: none;
        }
      </style>
    </defs>
    <title>icon-ct</title>
    <rect class="cls-1" x="3.75" y="12.1" width="24.49" height="4.17" />
    <path
      d="M28.24,10.85V2.54a1,1,0,0,0-1-1H24a1,1,0,0,0-1,1v8.31H21.36V2.54a1,1,0,0,0-1-1H17.15a1,1,0,0,0-1,1v8.31H14.38V6.64a1,1,0,0,0-1-1H4.75a1,1,0,0,0-1,1v4.21H2.56v6.66H29.43V10.85Zm-3.91-8H27v8H24.33Zm-6.88,0h2.67v8H17.45ZM5,6.82h8.26v4H5Zm23.24,9.45H3.75V12.1H28.24Z"
    />
    <rect class="cls-1" x="3.75" y="12.1" width="24.49" height="4.17" />
    <rect class="cls-1" x="24.33" y="2.82" width="2.67" height="8.03" />
    <rect class="cls-1" x="24.33" y="2.82" width="2.67" height="8.03" />
    <rect class="cls-1" x="17.45" y="2.82" width="2.67" height="8.03" />
    <rect class="cls-1" x="17.45" y="2.82" width="2.67" height="8.03" />
    <rect class="cls-1" x="5" y="6.82" width="8.26" height="4.03" />
    <rect class="cls-1" x="5" y="6.82" width="8.26" height="4.03" />
  </g>
  {:else}
  <g class="icon-instr">
    <path
      d="M25.76,1.77H6.24V15h5.87l-1.36,1.76a.47.47,0,0,0,.38.76h9.75a.47.47,0,0,0,.38-.76L19.9,15h5.86Zm-5.2,15.11H11.44L12.91,15H19.1Zm4.57-2.51H6.87V13.11H25.13Zm0-1.89H6.87V2.4H25.13Z"
    />
    <rect x="15.68" y="13.42" width="0.63" height="0.63" />
    <rect x="14.42" y="13.42" width="0.63" height="0.63" />
    <rect x="16.95" y="13.42" width="0.63" height="0.63" />
    <polygon
      points="22.45 4.61 21.27 3.04 20.36 5.18 19.46 3.68 18.45 5.36 17.71 4.61 16.63 4.61 16.63 5.24 17.45 5.24 18.58 6.38 19.46 4.9 20.45 6.56 21.43 4.29 22.14 5.24 23.24 5.24 23.24 4.61 22.45 4.61"
    />
    <rect x="16.63" y="7.75" width="6.61" height="0.63" />
    <rect x="16.63" y="9.33" width="6.61" height="0.63" />
    <rect x="20.72" y="10.91" width="2.52" height="0.63" />
    <path d="M8.45,3.66V6.18H11V3.66Zm1.88,1.89H9.07V4.29h1.26Z" />
    <path d="M8.45,8.7v2.52H11V8.7Zm1.88,1.89H9.07V9.33h1.26Z" />
    <polygon
      points="13.91 4.05 12.56 5.13 12.13 4.7 11.69 5.15 12.52 5.97 14.31 4.54 13.91 4.05"
    />
    <polygon
      points="13.91 9.08 12.56 10.17 12.13 9.74 11.69 10.18 12.52 11.01 14.31 9.58 13.91 9.08"
    />
  </g>
  {/if} {#if type == "IN"}
  <polygon
    class="icon-arrow-center-in"
    points="15.47 18.59 15.47 27.44 13.36 25.33 12.61 26.09 16 29.48 19.39 26.09 18.64 25.33 16.53 27.44 16.53 18.59 15.47 18.59"
  />
  {:else if type == "OUT"}
  <polygon
    class="icon-arrow-center-out"
    points="15.47 29.48 15.47 20.63 13.36 22.74 12.61 21.99 16 18.59 19.39 21.99 18.64 22.74 16.53 20.63 16.53 29.48 15.47 29.48"
  />
  {:else if type == "RIGHT-IN"}
  <path
    class="icon-arrow-right-in"
    d="M25.33,18.59v8.85l-2.1-2.11-.76.75,3.4,3.4,3.39-3.4-.75-.75L26.4,27.44V18.59Z"
  />
  {:else if type == "RIGHT-OUT"}
  <path
    class="icon-arrow-right-out"
    d="M25.33,29.48V20.63l-2.1,2.11L22.47,22l3.4-3.4L29.26,22l-.75.75L26.4,20.63v8.85Z"
  />
  {:else if type == "LEFT-IN"}
  <path
    class="icon-arrow-left-in"
    d="M6.5,18.59v8.85L4.39,25.33l-.75.75L7,29.48l3.4-3.4-.76-.75-2.1,2.11V18.59Z"
  />
  {:else if type == "LEFT-OUT"}
  <path
    class="icon-arrow-left-out"
    d="M6.5,29.48V20.63L4.39,22.74,3.64,22,7,18.59l3.4,3.4-.76.75-2.1-2.11v8.85Z"
  />
  {/if}
</svg>
