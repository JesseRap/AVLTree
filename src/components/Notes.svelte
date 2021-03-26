<style>
  @keyframes fadein {
    from { opacity: 0; }
    to { opacity: 1;}
  }

  .notes {
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
    animation: fadein 1s ease-in-out;
  }

  li {
    color: #fbc531;
    margin-left: -32px;
  }
</style>

<script>
  export let notes;

  $: {
    console.log('NOTES', $notes);
  }
</script>

<div id="notes" class="notes">
  <ul>
    {#each $notes as note}
      <li class="note-text">{note}</li>
    {/each}
  </ul>
</div>
