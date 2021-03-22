<style>
  .buttons {
    /* background-color: #353b48; */
    background-color: transparent;
    /* border: 1px solid black; */
    font-size: 20px;
    margin-bottom: 24px;
  }
  .buttons * {
    font-weight: bold;
  }
  .buttons--desktop {
    display: flex;
    width: 100%;
    justify-content: space-between;
    /* max-width: 1000px; */
    margin: auto auto 32px auto;
    flex-wrap: wrap;
    /* padding: 24px; */
  }

  .buttons--mobile {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
    /* padding: 24spx; */
  }

  .buttons--mobile > div {
    margin: 8px;
  }

  .buttons__button {
    background-color: transparent;
    /* background-color: #5d6a71e8; */
    color: #fbc531;
    text-transform: uppercase;
  }

  .buttons__input {
    background-color: transparent;
    color: #fbc531;
    cursor: default;
    text-align: center;
    width: 50px;
  }

  .buttons__input:focus {
    outline: none;
  }

  .buttons__icon {
    width: 50px;
    cursor: pointer;
  }

  .buttons__icon:focus {
    outline: none;
  }

  /* Hides arrows on number input */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }

  .buttons__button-container {
    width: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .buttons__label {
    background-color: transparent;
    color: #fbc531;
    cursor: pointer;
    text-align: center;
  }

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
  }
</style>
<script>
  export let onReset;
  export let runAnimations;
  export let renderer;
  let isBalanced = true;
  let group = 1;
  let value = true;

  $: {
    console.log("isBalanced", isBalanced);
  }

  let newVal = 0;
  const onNewValue = async () => {
		renderer.insert(newVal, isBalanced);
    renderer.stateGroup = renderer.stateGroup;
    await renderer.runLatestAnimationGroup();
		// tree = tree;
		// tree.insert(newVal);
		// tree = tree;
	};

  let findVal = 0;
  const onFindValue = async () => {
    renderer.find(findVal);
    renderer.stateGroup = renderer.stateGroup;
    await renderer.runLatestAnimationGroup();
    // tree.find(findVal);
  };

  let deleteVal = 0;
  const onDeleteVal = async () => {
    renderer.delete(deleteVal);
    renderer.stateGroup = renderer.stateGroup;
    await renderer.runLatestAnimationGroup();
    // tree.delete(deleteVal);
    // tree = tree;
  };

  const onInsertRandVal = async () => {
		let randVal = Math.floor(Math.random() * 50);

    renderer.insert(randVal, isBalanced);
    renderer.stateGroups = renderer.stateGroups;
    await renderer.runLatestAnimationGroup();
	};
</script>

<div class="buttons buttons--mobile">
	<div class="buttons__button-container">
		<input class="buttons__input" type="number" bind:value={newVal} />
    <img on:click={onNewValue} class="buttons__icon" role="button" tabindex="0" src="assets/AddIcon.svg" />
    <div on:click={onNewValue} class="buttons__label">INSERT</div>
	</div>
  <div class="buttons__button-container">
    <input class="buttons__input" type='text' value="&quest;" />
    <img class="buttons__icon" on:click={onInsertRandVal} role="button" tabindex="0" src="assets/AddIcon.svg" />
    <div class="buttons__label" on:click={onInsertRandVal}>RANDOM</div>
	</div>
	<div class="buttons__button-container">
		<input class="buttons__input" type='number' bind:value={findVal} />
    <img on:click={onFindValue} class="buttons__icon" role="button" tabindex="0" src="assets/FindIcon.svg" />
    <div on:click={onFindValue} class="buttons__label">FIND</div>
	</div>
	<div class="buttons__button-container">
		<input class="buttons__input" type='number' bind:value={deleteVal} />
    <img on:click={onDeleteVal} class="buttons__icon" role="button" tabindex="0" src="assets/RemoveIcon.svg" />
    <div on:click={onDeleteVal} class="buttons__label">DELETE</div>
	</div>
	<div class="buttons__button-container">
		<button class="buttons__button" on:click={onReset}>RESET</button>
    <img class="buttons__icon" on:click={onReset} role="button" tabindex="0" src="assets/ResetIcon.svg" />
    <div class="buttons__label">RESET</div>
	</div>
</div>
<div style="width: 100%; height: 100px; border: 1px solid red;">
<div class="buttons__balanced">
  <div class="checkbox" />
  <input type="radio" id="balanced" bind:group value={value} name="balance" checked>
  <label for="balanced">INSERT BALANCED</label>
  <label>
</div>
<div class="buttons__balanced">
<div class="checkbox" />
  <input type="radio" bind:group value={isBalanced} id="unbalanced" name="balance">
  <label for="unbalanced">INSERT UNBALANCED</label>
  <label>
</div>
</div>
