<script>
	import AVLTree from './AVLTree.js';
	import Tree from './Tree.svelte';
	let name = 'world';

	const tree = new AVLTree();

	console.log(tree.toString());

	tree.insert(4)
	console.log(tree.toString());

	tree.insert(5)
	console.log(tree.toString());

	tree.insert(3)
	console.log(tree.toString());

	tree.insert(7)
	console.log(tree.toString());

	tree.insert(6)
	console.log(tree.toString());

	tree.insert(9)
	console.log(tree.toString());

	tree.insert(2)
	console.log(tree.toString());

	tree.insert(1)
	console.log(tree.toString());

	tree.root = tree.rotateLeft(tree.root);
	console.log(tree.toString());


// 	const node = tree.root;
// 	tree.root = tree.rotateLeft(node);
// 	console.log('ROTATE');
// 	console.log(tree);

	// console.log(tree.toString());
</script>

<h1>Hello {name}!</h1>

<Tree />
