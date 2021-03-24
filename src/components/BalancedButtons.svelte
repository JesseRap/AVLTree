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
  export let isBalanced;
  export let setIsBalanced;
  export let value;
  let group = 1;
</script>

<div class="buttons__container">
<div class="buttons__balanced">
  <div class="checkbox" on:click={() => {setIsBalanced(true);}}/>
  {#if isBalanced}
    <div class="checkbox__icon" on:click={() => {setIsBalanced(true);}}>&#10004;
    </div>
  {/if}
  <input on:click={() => {setIsBalanced(true);}} type="radio" id="balanced" bind:group value={value} name="balance" checked>
  <label for="balanced">INSERT BALANCED</label>
</div>
<div class="buttons__balanced">
  <div class="checkbox" on:click={() => {setIsBalanced(false);}}/>
  {#if !isBalanced}
    <div class="checkbox__icon" on:click={() => {setIsBalanced(false);}}>&#10004;
  </div>
  {/if}
  <input on:click={() => {setIsBalanced(false);}} type="radio" bind:group value={isBalanced} id="unbalanced" name="balance">
  <label for="unbalanced">INSERT UNBALANCED</label>
  </div>
</div>
