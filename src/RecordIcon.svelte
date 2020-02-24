<script>
  import Icon from "./Icon.svelte";

  export var iconName;
  export var iconType;
  export var status;
  export var hidden;
  export var bounce;

  $: fillColor = status == "WARNING" ? "#212529" : "#fff";
</script>

<div class="icon" data-status="{status}">
  <Icon
    fill="{fillColor}"
    {hidden}
    {bounce}
    name="{iconName}"
    type="{iconType}"
  ></Icon>
</div>

<style>
  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2.5rem;
    height: 2.5rem;
    margin: 0 1.2rem;
    border-radius: 50%;
    box-shadow: 0 0 0 4px hsl(0, 0%, 100%), inset 0 2px 0 rgba(0, 0, 0, 0.08),
      0 3px 0 4px rgba(0, 0, 0, 0.05);
  }

  @media (min-width: 40rem) {
    .icon {
      width: 3.75rem;
      height: 3.75rem;
      will-change: transform;
    }
  }

  .icon[data-status="NORMAL"] {
    background-color: #75cd65;
  }

  .icon[data-status="WARNING"] {
    background-color: #ffc107;
  }

  .icon[data-status="DANGER"] {
    background-color: #dc3545;
  }
</style>
