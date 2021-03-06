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

<div style="background-color: #353b48;display: flex;width: 70%;justify-content: space-between;max-width: 1000px;margin: auto auto 32px auto;flex-wrap: wrap;padding: 24px;">
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
