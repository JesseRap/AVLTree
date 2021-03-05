<style>
	.svg-main {
		/* backgrosund-color: #3557ca; */
		background-color: #2b5ada;

	}
	.container-container {
		height: 90%;
		background: linear-gradient(#2c5bd9 0%, #273c75 50%, #2c5bd9 100%);
	}
</style>
<script>
	import anime from 'animejs/lib/anime.es.js';

	import { afterUpdate, onMount, tick } from 'svelte';
	import AVLTree from '../lib/AVLTree.js';
	import Node from './Node.svelte';
	import Buttons from './Buttons.svelte'
	import Header from './Header.svelte';
	import { createSVGElement } from '../utils/svg';
	import { getCxArr, getCyArr } from '../utils/tree';

	let svgContainer; // The container for the AVL SVG.

	const XMLNS = 'http://www.w3.org/2000/svg';

	let theTree = new AVLTree();
	let svg;
	let svgHeap = new Array(0);

 	$: states = theTree.states;

	$: {
		console.log('STATES!!!!!', states);
	}

	$: runLatestAnimation(states.length);

	let cxArr = [];
	let cyArr = [];

	/**
	 * Takes heap from tree and updates global `svgHeap`, copying nodes with equal id's.
	 */
	const updateSVGHeap = tree => {
		if (!tree.root) return new Array(0);
		const heap = tree.heap;
		svgHeap = heap.map(node => {
			if (!node) return null;
			return svgHeap.find(el => el?.id === String(node.id)) || createNodeSVG(node);
		});
	}

	const createNodeSVG = node => {
		console.log('createNodeSVG!!');

		const g = document.createElementNS(XMLNS, 'g');
		g.setAttribute('id', node.id);
		const n = new Node({
			target: g,
			props: {
				balance: node.balance,
				value: node.val
			}
		});

		return g;
	};

	const removeOldNodes = (tree) => {
		const heap = tree.heap;
		for (let i = 0; i < Math.max(heap.length, svgHeap.length); i++) {
			if (heap[i] === null && i < svgHeap.length) {
				svgHeap[i] = null;
			}
		}
	};

	const removeAllChildrenFromSVG = () => {
		Array.from(svg.children).forEach(child => {
			svg.removeChild(child);
		});
	};

	const childExistsInNode = (child, node) => Array.from(node.children).some(childNode =>
		childNode.id === child.id
	);

	const insertNewNodesIntoSVG = (svgHeap, svg) => {
		svgHeap.forEach(group => {
			if (!group) {
				return;
			}
			Array.from(svg.children).forEach(child => {
			})
			if (!childExistsInNode(group, svg)) {
				svg.appendChild(group);
			}
		});
	}

	const putElementsOnSVG = tree => {
		if (svg && !tree.root) {
			removeAllChildrenFromSVG(svg);
			return;
		}
		insertNewNodesIntoSVG(svgHeap, svg);
	};

	const updateNodeCoords = tree => {
		if (!tree.root) svgHeap = [];
		svgHeap.forEach((group, index) => {
			if (group) {
				anime({
					targets: group,
					translateX: `${cxArr[index]}%`,
					translateY: `${cyArr[index]}%`,
					duration: 1000
				});

				// group.style.transform = `translate(${cxArr[index]}%, ${cyArr[index]}%)`;

				const balance = group.querySelector('.balance');
				const heap = tree.heap;
				balance.innerHTML = heap[index].balance;
				balance.setAttributeNS(null, 'fill', (Math.abs(heap[index].balance)) === 0 ? '#7f8fa6' : (Math.abs(heap[index].balance)) === 1 ? '#c23616' : '#e84118');

				const balanceLineGroup = group.querySelector('.balance-line-group');
				balanceLineGroup.setAttribute('style', heap[index].balance === 0 ? 'transform: rotate(0);' : heap[index].balance === 1 ? 'transform: rotate(7deg);' : 'transform: rotate(-7deg)');

				const balanceNumberGroup = group.querySelector('.balance-number-group');
				balanceNumberGroup.setAttribute('style', heap[index].balance === 0 ? 'transform: translate(0, 0)' : heap[index].balance === 1 ? 'transform: translate(20px, 5px);' : 'transform: translate(-20px, 5px)');

				if (Math.abs(heap[index].balance) > 0) {
					balanceLineGroup.parentElement.classList.add('wobble');
				} else {
					balanceLineGroup.parentElement.classList.remove('wobble');
				}
			}
		});
	};

	const createPath = (tree, node) => {
		if (!node) return;
		const i = tree.getNodeIndex(node);
		if (i === 0) return;
		if (i === -1) throw new Error('Node not found.');
		const nodeId = node.id;
		const parent = tree.heap[Math.floor((i - 1) / 2)];
		const parentId = parent.id;
		const path = document.createElementNS(XMLNS, 'path');
		const pathId = `${nodeId}-${parentId}`
		path.setAttribute('id', pathId);
		path.setAttributeNS(null, 'd', `M ${cxArr[i]} ${cyArr[i]} L ${cxArr[tree.parentArray[i]]} ${cyArr[tree.parentArray[i]]}`);
		path.setAttributeNS(null, "stroke", "black");
		path.setAttributeNS(null, "fill", "transparent");
		path.setAttributeNS(null, 'stroke-dasharray', '100');
		path.setAttributeNS(null, 'stroke-dashoffset', '0%');
		// path.setAttributeNS(null, 'stroke-dashoffset', '-100%');
		// anime({
		// 	targets: path,
		// 	'stroke-dashoffset': '0%',
		// 	duration: 1000,
		// 	delay: 100
		// });
		return path;
	};

	// const switchParentEdges = (tree, child) => {
	// 	const parent = tree.getParentNode(child);
	// 	const oldPath = `${child.id}-${parent.id}`;
	// 	const newPath = `${parent.id}-${child.id}`;
	// 	const path = edgesMemo[oldPath];
	// 	edgesMemo[newPath] = path;
	// 	delete edgesMemo[oldPath];
	// };

	let edgesMemo = {};
	const drawEdges = tree => {
		const heap = tree.heap;

		const keys = [];

		for (let i = 0; i < heap.length; i++) {
			const node = heap[i];
			if (i === 0 || !node) continue;
			const parent = heap[Math.floor((i - 1) / 2)];
			const nodeId = node.id;
			const parentId = parent.id;
			const key = `${nodeId}-${parentId}`;
			keys.push(key);
			console.log("KEY", key)
			console.log("edgesMemo", edgesMemo)
			console.log("svgHeap", svgHeap)
			if (edgesMemo[key]) {
				const path = edgesMemo[key];
				// if (path && !heap[i]) {
				// 	svg.removeChild(path);
				// 	delete edgesMemo[i];
				// }
				path.setAttributeNS(null, 'd', `M ${cxArr[i]} ${cyArr[i]} L ${cxArr[tree.parentArray[i]]} ${cyArr[tree.parentArray[i]]}`);
				// if (!heap[i] && edgesMemo[i]) {
				// 	svg.removeChild(path);
				// }
			} else {
				console.log('NEW PATH');
				const path = createPath(tree, node);
				const firstNode = svg.children[0];
				svg.insertBefore(path, firstNode);
				path.setAttributeNS(null, 'd', `M ${cxArr[i]} ${cyArr[i]} L ${cxArr[tree.parentArray[i]]} ${cyArr[tree.parentArray[i]]}`);
				// path.setAttributeNS(null, 'stroke-dashoffset', '0%');
				path.setAttributeNS(null, 'stroke-dashoffset', '-100%');
				anime({
					targets: path,
					'stroke-dashoffset': '0%',
					duration: 500,
					delay: 200
				});
				edgesMemo[key] = path;
			}
		}

		Object.keys(edgesMemo).forEach(key => {
			if (!keys.includes(key)) {
				anime({
					targets: edgesMemo[key],
					opacity: 0,
					duration: 500,
					delay: 1000
				});
				const path = edgesMemo[key];
				setTimeout(() => {
					svg.removeChild(path);
				}, 1000);
				delete edgesMemo[key];
			}
		});
	};

	const updateSvg = (t) => {
		const myTree = t || theTree;
		console.log('updateSvg', myTree, cxArr, cyArr)
		// console.log('cyArr prev', cyArr);
		cyArr = getCyArr(myTree);
		console.log('cyArr post', cyArr);

		// console.log('cxArr prev', cxArr);
		cxArr = getCxArr(myTree);
		console.log('cxArr post', cxArr);
		console.log('updateSVGHeap');
		updateSVGHeap(myTree);
		console.log('removeOldNodes');
		removeOldNodes(myTree);
		console.log('drawEdges');
		drawEdges(myTree);
		// await wait(1000);
		// await tick();
		console.log('updateNodeCoords');
		updateNodeCoords(myTree);
		console.log('putElementsOnSVG');
		putElementsOnSVG(myTree);
		// renderTree();
		// console.log("HEAP STRING", theTree.toHeapString());
		// console.log("HEAP STRING 2", myTree.toHeapString());
		console.log("STATES", theTree.states);
		// const copy = theTree.copy();
		// console.log("COPY", copy);
	};

	const wait = ms => new Promise(res => setTimeout(res, ms));

	const runLatestAnimation = async () => {
		runAnimation(states.length - 1)
	}

	// const deleteEdges = tree => {
	// 	const heap = tree.heap;
	// 	const paths = [];
	// 	for (let i = heap.length; i >=0; i--) {
	// 		const node = heap[i];
	// 		if (i === 0 || !node) return;
	// 		const nodeId = node.id;
	// 		const parent = tree.getParentNode(node);
	// 		if (!parent) return;
	// 		const parentId = parent.id;
	// 		const path = `${nodeId}-${parentId}`;
	// 		paths.push(path);
	// 	}
	// 	Object.keys(edgesMemo).forEach(key => {
	// 		if (!paths.includes(key)) {
	// 			delete edgesMemo[key];
	// 			const edge = svg.querySelector(`#${key}`);
	// 			svg.removeChild(edge);
	// 		}
	// 	})
	// };

	const animateNode = (tree, node) => {
		const s = svgHeap.find(el => el?.id === String(node.id));
		console.log('animateNode', s);
		if (s) {
			const circle = s.querySelector('circle');
			circle.setAttributeNS(null, 'fill', '#4cd137');
			circle.classList.add('visited-node');
		}
	};

	const clearAllVisitedNodes = tree => {
		const visitedCircles = Array.from(document.querySelectorAll('.visited-node'));
		visitedCircles.forEach(circle => {
			circle.setAttributeNS(null, 'fill', '#00a8ff');
			circle.classList.remove('visited-node');
		});
	};

	const runAnimation = async index => {
		console.log('runAnimation', states);
		// edgesMemo = {};
		const state = states[index];
		for (let i = 0; i < state.length; i++) {
			console.log('STATE!', state[i].type, state, Object.keys(edgesMemo), svgHeap);
			// edgesMemo = {};

			if (state[i].type === 'insert') {
			}

			if (state[i].type === 'rebalance') {
				const { pivotId, rotatedId, parentId } = state[i];
				const oldPath = `${rotatedId}-${pivotId}`;
				const newPath = `${pivotId}-${rotatedId}`;

				const edge = edgesMemo[oldPath];
				edgesMemo[newPath] = edge;
				delete edgesMemo[oldPath];
				edge.setAttribute('id', newPath);

				// deleteEdges(state[i].tree);

				if (parentId !== undefined) {
					const oldParentPath = `${pivotId}-${parentId}`;
					const newParentPath = `${rotatedId}-${parentId}`;

					const parentEdge = edgesMemo[oldParentPath];
					edgesMemo[newParentPath] = parentEdge;
					delete edgesMemo[oldParentPath];
					parentEdge.setAttribute('id', newParentPath);
				}

				const heap = state[i - 1].tree.heap;
				const pivotNode = heap.find(el => el?.id === pivotId);
				const rotatedNode = heap.find(el => el?.id === rotatedId);
				const rotatedNodeIndex = heap.indexOf(rotatedNode);

				const isRight = rotatedNodeIndex % 2 === 0;

				const grandChild = rotatedNode[isRight ? 'left' : 'right']

				if (grandChild) {
					console.log('grandchild', grandChild);
					const oldPath = `${grandChild.id}-${rotatedNode.id}`;
					const newPath = `${grandChild.id}-${pivotNode.id}`;
					const edge = edgesMemo[oldPath];
					edgesMemo[newPath] = edge;
					delete edgesMemo[oldPath]
					edge.setAttribute('id', newPath);
				}

				// const pivotNode = svg.querySelector(oldPath);
				// const pivotNodeIndex = state[i].heap.indexOf(pivotNode);
				//
				// const parent = pivotNodeIndex === 0 ? null state[i].tree.heap[Math.floor((pivotNodeIndex - 1) / 2)];
				//
				// const otherChild = Array.from(parent.children).find(child =>)
			}

			if (state[i].type === 'visitNode') {
				animateNode(state[i].tree, state[i].node);
			}

			if (state[i].type === 'insertFinish') {
				clearAllVisitedNodes(state[i].tree);
			}

			// drawEdges(state[i].tree);

			updateSvg(state[i].tree);
			await wait(500);
			// await tick();
			console.log('STATE FINISHED!', state[i].type, Object.keys(edgesMemo), svgHeap);
			//
		}
	};

	const runAnimations = async () => {
		console.log('runAnimations', states);
		for (let i = 0; i < states.length; i++) {
			await runAnimation(i);
		}
	};

	const onReset = () => {
		theTree = states[0][0].tree
		edgesMemo = {};
		updateSvg(theTree);
	}

	const update = tree => {
		console.log('UPDATE!!!');
		theTree = tree;
		updateSvg(tree);
	}

	onMount(() => {
		// Create root SVG.
		svg = createSVGElement();
		svg.classList.add('svg-tree');
		svg.style['background-color'] = "#2b5ada";

		console.log('svgHeap', svgHeap)

		// Append root SVG to svgContainer
		svgContainer.appendChild(svg);
		updateSvg(theTree);

		console.log('svgHeap', svgHeap);

	});
</script>

<div>
	<Header />

	<div class="container-container" width="100%">

		<div bind:this={svgContainer} class="container" style="width: 100%; max-width: 1000px; margin: auto;"/>

	</div>
	<Buttons bind:tree={theTree} {onReset} {runAnimations} />
</div>
