<script>
  export var title;
  export var content;
</script>

<div class="content-text">
  <h3>{@html title}</h3>
  <div>{@html content}</div>
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
