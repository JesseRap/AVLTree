<style>
  .buttons__balanced {
    color: #fbc531;
    display: flex;
    font-weight: 600;
    font-size: 20px;
    position: relative;
  }

  input[type=radio]
  {
   display: none;
  }

  .checkbox {
    width: 20px;
    height: 20px;
    background: transparent;
    border-bottom: 1px solid #ccc;
    margin: 0 4px;
    position: relative;
  }

  .checkbox__icon {
    width: 20px;
    height: 20px;
    position: absolute;
    left: 8px;
  }

  .buttons__container {
    width: 100%;
    height: 60px;
  }
</style>

<script>
  export let isShowing;
  export let setShowNotes;
  export let value;
  let group = 1;
</script>

<div class="buttons__container">
<div class="buttons__balanced">
  <div class="checkbox" on:click={() => {setShowNotes(true);}}/>
  {#if isShowing}
    <div class="checkbox__icon" on:click={() => {setShowNotes(true);}}>&#10004;
    </div>
  {/if}
  <input on:click={() => {setShowNotes(true);}} type="radio" id="showtext" bind:group value={value} name="balance" checked>
  <label for="showtext">SHOW TEXT</label>
</div>
<div class="buttons__balanced">
  <div class="checkbox" on:click={() => {setShowNotes(false);}}/>
  {#if !isShowing}
    <div class="checkbox__icon" on:click={() => {setShowNotes(false);}}>&#10004;
  </div>
  {/if}
  <input on:click={() => {setShowNotes(false);}} type="radio" bind:group value={isShowing} id="hidetext" name="balance">
  <label for="hidetext">HIDE TEXT</label>
  </div>
</div>
