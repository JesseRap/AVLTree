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

<div style="display: flex; width: 100%; justify-content: space-between">
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
