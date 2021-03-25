<style>
  .notes {
    border: 1px solid red;
    height: 100%;
    width: 400px;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }

  .note-text {
    color: #fbc531;
    list-style-type: none;
  }
</style>

<script>
  export let notes;
  let n = [];

  notes.subscribe(value => {
    debugger;
    console.log("VALUE", value);
    if (value) {
      n = value;
    }
  });
</script>

<div id="notes" class="notes">
  <ul>
    {#each n as note}
      <li class="note-text">{note}</li>
    {/each}
  </ul>
</div>
