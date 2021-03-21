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
    text-align: center;
    width: 50px;
  }

  .buttons__icon {
    max-width: 100px;
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

  /* DESKTOP */
  /* @media (min-width: 1200px) {
    .buttons--mobile {
      display: none;
    }
    .buttons--desktop {
      display: flex;
      width: 300px;
    }
    .svg-main {
      margin-left: 0px;
    }
  } */

  /* MOBILE */
  /* @media (max-width: 1199px) {
    .buttons--mobile {
      display: flex;
    }
    .buttons--desktop {
      display: none;
    }
  } */
</style>
<script>
  export let onReset;
  export let runAnimations;
  export let renderer;

  let newVal = 0;
  const onNewValue = async () => {
		renderer.insert(newVal);
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
    // console.log("FINDVAL", findVal)
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
		console.log('onInsertRandVal *!@#!&@#&*', randVal);

    renderer.insert(randVal);
    renderer.stateGroups = renderer.stateGroups;
    await renderer.runLatestAnimationGroup();
	};
</script>

<div class="buttons buttons--mobile">
	<div class="buttons__button-container">
		<input class="buttons__input" type="number" bind:value={newVal} />
    <img class="buttons__icon" role="button" tabindex="0" src="assets/AddIcon.svg" />
	</div>
  <div class="buttons__button-container">
    <input on:click={onInsertRandVal} class="buttons__input" type='text' value="&quest;" />
    <img class="buttons__icon" on:click={onInsertRandVal} role="button" tabindex="0" src="assets/AddIcon.svg" />
		<!-- <button class="buttons__button" on:click={onNewValue}>New Value</button> -->
	</div>
	<div class="buttons__button-container">
		<input class="buttons__input" type='number' bind:value={findVal} />
		<!-- <button class="buttons__button" on:click={onFindValue}>Find Value</button> -->
    <img class="buttons__icon" role="button" tabindex="0" src="assets/FindIcon.svg" />
	</div>
	<div class="buttons__button-container">
		<input class="buttons__input" type='number' bind:value={deleteVal} />
    <img class="buttons__icon" role="button" tabindex="0" src="assets/RemoveIcon.svg" />
	</div>
	<div class="buttons__button-container">
		<button class="buttons__button" on:click={onReset}>RESET</button>
    <img class="buttons__icon" on:click={onReset} role="button" tabindex="0" src="assets/ResetIcon.svg" />
	</div>
</div>

<slot></slot>
