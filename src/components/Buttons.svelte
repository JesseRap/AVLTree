<style>
  .buttons--desktop {
    background-color: #353b48;
    display: flex;
    width: 100%;
    justify-content: space-between;
    /* max-width: 1000px; */
    margin: auto auto 32px auto;
    flex-wrap: wrap;
    padding: 24px;
  }

  .buttons--mobile {
    background-color: #353b48;
    display: flex;
    flex-direction: column;
    padding: 24px;
  }

  /* DESKTOP */
  @media (min-width: 1200px) {
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
  }

  /* MOBILE */
  @media (max-width: 1199px) {
    .buttons--mobile {
      display: flex;
    }
    .buttons--desktop {
      display: none;
    }
  }
</style>
<script>
  export let tree;
  export let onReset;
  export let runAnimations;

  let newVal = 0;
  const onNewValue = () => {
		tree.insert(newVal);
		tree = tree;
	};

  let findVal = null;
  const onFindValue = () => {
    console.log("FINDVAL", findVal)
    tree.find(findVal);
  };

  const onInsertRandVal = () => {
		let randVal = Math.floor(Math.random() * 50);
		console.log('onInsertRandVal *!@#!&@#&*', randVal);
		tree.insert(randVal);
		tree = tree;
		// updateSvg(theTree);
	};
</script>

<div class="buttons buttons--mobile">
	<div>
		<input type='number' bind:value={newVal} />
		<button on:click={onNewValue}>New Value</button>
	</div>
	<div>
		<input type='number' bind:value={findVal} />
		<button on:click={onFindValue}>Find Value</button>
	</div>
	<div>
		<button on:click={onInsertRandVal}>Insert Random Value</button>
	</div>
	<div>
		<button on:click={onReset}>RESET</button>
	</div>
	<div>
		<button on:click={runAnimations}>ANIMATE</button>
	</div>
</div>

<div class="buttons buttons--desktop buttons--desktop-left">
  <div>
    <input type='number' bind:value={newVal} />
    <button on:click={onNewValue}>New Value</button>
  </div>
  <div>
    <input type='number' bind:value={findVal} />
    <button on:click={onFindValue}>Find Value</button>
  </div>
  <div>
    <button on:click={onInsertRandVal}>Insert Random Value</button>
  </div>
</div>

<slot></slot>

<div class="buttons buttons--desktop buttons--desktop-right">
  <div>
    <button on:click={onReset}>RESET</button>
  </div>
  <div>
    <button on:click={runAnimations}>ANIMATE</button>
  </div>
</div>
