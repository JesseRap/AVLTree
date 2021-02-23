<script>
	import { afterUpdate, onMount } from 'svelte';
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

		tree.insert(5)
		console.log(tree.toString());
		console.log(tree.root);

		tree.insert(2)
		console.log(tree.toString());
		console.log(tree.root);

		tree.insert(0)
		console.log(tree.toString());
		console.log(tree.root);

		tree.insert(9)
		console.log(tree.toString());
		console.log(tree.root);

		svg = tree.renderTree();
		container.appendChild(svg);
	});

	const updateSvg = () => {
		const temp = svg;
		svg = tree.renderTree();
		container.replaceChild(svg, temp);
	};

	let newVal = 0;
	const onClick = () => {
		tree.insert(newVal);
		updateSvg();
	};
</script>

<h1>Hello {name}!</h1>

<div bind:this={container} style="width: 100%; height: 100%"/>

<input type='number' bind:value={newVal} />
<button on:click={onClick}>New Value</button>

<!-- <SVGTree /> -->
