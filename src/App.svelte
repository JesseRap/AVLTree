<script>
	import anime from 'animejs/lib/anime.es.js';

	import { afterUpdate, onMount, tick } from 'svelte';
	import AVLTree from './AVLTree.js';
	import SVGTree from './SVGTree.svelte';
	import Tree from './Tree.svelte';
	let name = 'world';
	let container;

	// tree.insert(7)
	// console.log(tree.toString());
	//
	// tree.insert(6)
	// console.log(tree.toString());
	//
	// tree.insert(9)
	// console.log(tree.toString());
	//
	// tree.insert(2)
	// console.log(tree.toString());
	//
	// tree.insert(1)
	// console.log(tree.toString());
	//
	// tree.root = tree.rotateLeft(tree.root);
	// console.log(tree.toString());


// 	const node = tree.root;
// 	tree.root = tree.rotateLeft(node);
// 	console.log('ROTATE');
// 	console.log(tree);

	// console.log(tree.toString());
	//
	let child;
	let tree;
	let svg;
	onMount(() => {
		tree = new AVLTree();

		console.log(tree.toString());
		console.log(tree.root);

		tree.insert(1)
		console.log(tree.toString());
		console.log(tree.root);

		tree.insert(3)
		console.log(tree.toString());
		console.log(tree.root);
		//
		// tree.insert(5)
		// console.log(tree.toString());
		// console.log(tree.root);
		//
		// tree.insert(2)
		// console.log(tree.toString());
		// console.log(tree.root);
		//
		// tree.insert(0)
		// console.log(tree.toString());
		// console.log(tree.root);
		//
		// tree.insert(9)
		// console.log(tree.toString());
		// console.log(tree.root);

		svg = tree.renderTree();
		container.appendChild(svg);

		// tick().then(() => {
		// 	anime({
		// 		targets: svg,
		// 		scale: 2,
		// 		direction: 'alternate',
		// 		duration: 1000,
		// 		easing: 'easeInOutExpo'
		// 	});
		// });
	});

	const updateSvg = () => {
		const temp = svg;
		svg = tree.renderTree();
		container.replaceChild(svg, temp);
	};

	let newVal = 0;
	const onNewValue = () => {
		tree.insert(newVal);
		updateSvg();
	};

	let findVal = null;
	const onFindValue = () => {
		console.log("FINDVAL", findVal)
		tree.find(findVal);
	};
</script>

<h1 class="hello">Hello {name}!</h1>

<div bind:this={container} style="width: 100%; height: 100%"/>

<div>
	<input type='number' bind:value={newVal} />
	<button on:click={onNewValue}>New Value</button>
</div>
<div>
	<input type='number' bind:value={findVal} />
	<button on:click={onFindValue}>Find Value</button>
</div>
