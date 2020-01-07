<script>
  import Icon from "./Icon.svelte";

  export var iconName;
  export var iconType;
  export var status;
  export var hide;
  export var bounceIn;

  $: fillColor = status == "WARNING" ? "#212529" : "#fff";
</script>

<div class="icon" data-status="{status}">
  <Icon
    fill="{fillColor}"
    {hide}
    {bounceIn}
    name="{iconName}"
    type="{iconType}"
  ></Icon>
</div>

<style>
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0 0 0 4px hsl(0, 0%, 100%), inset 0 2px 0 rgba(0, 0, 0, 0.08),
      0 3px 0 4px rgba(0, 0, 0, 0.05);
  }

  @media (min-width: 640px) {
    .icon {
      width: 60px;
      height: 60px;
      order: 1;
      margin-left: 25px;
      will-change: transform;
    }
  }

  .icon[data-status="NORMAL"] {
    background-color: var(--cd-color-4);
  }

  .icon[data-status="WARNING"] {
    background-color: #ffc107;
  }

  .icon[data-status="DANGER"] {
    background-color: #dc3545;
  }
</style>
