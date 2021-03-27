<style>
  .svg-main__container {
    position: relative;
    flex-grow: 1;
  }
</style>

<script>
  import TreeSVG from './TreeSVG.svg.svelte';
  import AboutSVG from './AboutSVG.svg.svelte';
  import Notes from './Notes.svelte';
  export let notes
  export let showNotes
</script>

<div id="svg-main__container" class="svg-main__container">

  <TreeSVG />
  {#if showNotes}
    <Notes {notes} />
  {/if}
  <AboutSVG />

</div>
