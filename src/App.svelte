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
	import AVLTree from './AVLTree.js';
	import Node from './Node.svelte';

	let container;

	const XMLNS = 'http://www.w3.org/2000/svg';

	let theTree = new AVLTree();
	let svg;
	let svgHeap = new Array(0);
	let rotateIndex = 0;

 	$: states = theTree.states;

	$: {
		console.log('STATES!!!!!', states);
	}

	$: runLatestAnimation(states.length);

	let cxArr = [];
	let cyArr = [];

	const createSVGElement = () => {
		const svg = document.createElementNS(XMLNS, 'svg');
    svg.setAttributeNS(null, 'width', '80%');
    svg.setAttributeNS(null, 'height', '80%');
    svg.style.border = '1px solid black';
    svg.style.marginLeft   = '10%';
    svg.setAttribute('class', 'svg-main');
    svg.setAttributeNS(null, 'viewBox', '0 0 100 100');

		const defs = document.createElementNS(XMLNS, 'defs');
		const filter = document.createElementNS(XMLNS, 'filter');
		filter.setAttribute('id', 'shadow');
		const feDropShadow = document.createElementNS(XMLNS, 'feDropShadow');
		feDropShadow.setAttributeNS(null, 'dx', '2');
		feDropShadow.setAttributeNS(null, 'dy', '1.4');
		feDropShadow.setAttributeNS(null, 'stdDeviation', '1.2');
		filter.appendChild(feDropShadow);
		defs.appendChild(filter);
		svg.appendChild(defs);

		console.log('asfjkahsldjf;m', svg);

		return svg;
	};

	const getCxArr = tree => {
		if (!tree.root) return new Array(0);
		const levels = tree.getLevels();
		const result = levels.reduce((acc, level, index) => {
			const cxInc = 1 / Math.pow(2, index) * 100;
			return [...acc, ...level.map((_, idx) => (cxInc / 2) + (cxInc * idx))];
		}, []);
		return result;
	};

	const getCyArr = tree => {
		if (!tree.root) return new Array(0);
		const cyInc = 1 / (tree.root.height + 1) * 100;
		const levels = tree.getLevels();
		const result = levels.reduce((acc, level, index) => (
			[...acc, ...level.map(_ => (cyInc / 2) + (cyInc * index))]
		), []);
		// console.log('CYARR', result);
		return result;
	};

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

	const rotateLeft = () => {
		// tree.root = tree.rotateLeft(tree.root);
		theTree.rotateLeftIndex(theTree.heap[rotateIndex]);
		theTree = theTree;
		updateSvg(theTree);
	};

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

	const removeAllChildrenFromNode = node => {
		Array.from(node.children).forEach(child => {
			svg.removeChild(child);
		});
	};

	const childExistsInNode = (child, node) => Array.from(node.children).some(childNode =>
		childNode.id === child.id
	);

	const insertElementsIntoNode = (svgHeap, svg) => {
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
			removeAllChildrenFromNode(svg);
			return;
		}
		insertElementsIntoNode(svgHeap, svg);
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
		path.setAttributeNS(null, 'stroke-dashoffset', '-100%');
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
			if (edgesMemo[key]) {
				console.log("edgesMemo 1", JSON.stringify(edgesMemo));
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
				console.log("NEW PATH");
				const path = createPath(tree, node);
				const firstNode = svg.children[0];
				svg.insertBefore(path, firstNode);
				path.setAttributeNS(null, 'stroke-dashoffset', '-100%');
				anime({
					targets: path,
					'stroke-dashoffset': '0%',
					duration: 1000,
					delay: 1000
				});
				edgesMemo[key] = path;
			}
			console.log("edgesMemo 2", JSON.stringify(edgesMemo));
		}

		console.log('SOY!', keys, Object.keys(edgesMemo))

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
		})


		// for (let i = 0; i < svgHeap.length; i++) {
		// 	if (edgesMemo[i]) {
		// 		const path = edgesMemo[i];
		// 		if (path && !heap[i]) {
		// 			svg.removeChild(path);
		// 			delete edgesMemo[i];
		// 		}
		// 		path.setAttributeNS(null, 'd', `M ${cxArr[i]} ${cyArr[i]} L ${cxArr[tree.parentArray[i]]} ${cyArr[tree.parentArray[i]]}`);
		// 		if (!heap[i] && edgesMemo[i]) {
		// 			svg.removeChild(path);
		// 		}
		// 	}
		// 	if (heap[i] && heap[tree.parentArray[i]]) {
		// 		if (!edgesMemo?.[i]) {
		// 			const path = createPath(tree, heap[i]);
		// 			svg.append(path);
		// 			path.setAttributeNS(null, 'stroke-dashoffset', '-100%');
		// 			anime({
		// 				targets: path,
		// 				'stroke-dashoffset': '0%',
		// 				duration: 1000,
		// 				delay: 1000
		// 			});
		// 			edgesMemo[i] = path;
		// 		}
		// 	} else {
		// 		delete edgesMemo[i];
		// 	}
		// }
	};

	const updateSvg = (t) => {
		const myTree = t || theTree;
		console.log('updateSvg', myTree, cxArr, cyArr)
		console.log('cyArr prev', cyArr);
		cyArr = getCyArr(myTree);
		console.log('cyArr post', cyArr);

		console.log('cxArr prev', cxArr);
		cxArr = getCxArr(myTree);
		console.log('cxArr post', cxArr);
		console.log('updateSVGHeap');
		updateSVGHeap(myTree);
		console.log('removeOldNodes');
		removeOldNodes(myTree);
		console.log('drawEdges');
		drawEdges(myTree);
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





	let newVal = 0;
	const onNewValue = () => {
		theTree.insert(newVal);
		theTree = theTree;
	};

	let findVal = null;
	const onFindValue = () => {
		console.log("FINDVAL", findVal)
		theTree.find(findVal);
	};

	const wait = ms => new Promise(res => setTimeout(res, ms));

	const runLatestAnimation = async () => {
		runAnimation(states.length - 1)
	}

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
			console.log('STATE!', state[i].type, state, edgesMemo);
			// edgesMemo = {};

			if (state[i].type === 'insert') {

			}

			if (state[i].type === 'rebalance') {
				const { pivotId, rotatedId } = state[i];
				const oldPath = `${rotatedId}-${pivotId}`;
				const newPath = `${pivotId}-${rotatedId}`;
				const edge = edgesMemo[oldPath];
				edgesMemo[newPath] = edge;
				delete edgesMemo[oldPath];

				// const pivotIndex = state[i].tree.heap.findIndex(el => el?.id === pivotId);
				// const rotatedIndex = state[i].tree.heap.findIndex(el => el?.id === rotatedId);
				//
				// const parent = pivotIndex === 0 ? null : state[i].tree.heap[Math.floor((pivotIndex - 1) / 2)];
				// if (parent) {
				// 	const parentId  = parent.id;
				// 	const oldPath = `${pivotId}-${parentId}`;
				// 	const path = edgesMemo[oldPath];
				// 	const newPath = `${parentId}-${parentId}`;
				// 	edgesMemo[newPath] = path;
				// 	delete edgesMemo[oldPath];
				// }
			}

			if (state[i].type === 'visitNode') {
				animateNode(state[i].tree, state[i].node);
			}

			if (state[i].type === 'insertFinish') {
				clearAllVisitedNodes(state[i].tree);
			}

			drawEdges(state[i].tree);

			updateSvg(state[i].tree);
			// await tick();
			await wait(1000);
		}
	};

	const runAnimations = async () => {
		console.log('runAnimations', states);
		for (let i = 0; i < states.length; i++) {
			await runAnimation(i);
		}
	};

	const onInsertRandVal = () => {
		let randVal = Math.floor(Math.random() * 50);
		if (edgesMemo[randVal]) {
			randVal = Math.floor(Math.random() * 50);
		}
		console.log('onInsertRandVal *!@#!&@#&*', randVal);
		theTree.insert(randVal);
		theTree = theTree;
		// updateSvg(theTree);
	}

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
		svg = createSVGElement();
		svg.classList.add('svg-tree');
		svg.style['background-color'] = "#2b5ada";

		console.log('svgHeap', svgHeap)

		container.appendChild(svg);
		updateSvg(theTree);

		console.log('svgHeap', svgHeap);

	});
</script>
<div>
<header class="svg-container-header">
	<div class="svg-container">
		<svg class="header-svg" width="100%" height="100" viewBox="0 0 100 100">
			<text x="50%" y="50%" text-anchor="middle" >pretty avl tree</text>
		</svg>
	</div>
</header>

<div class="container-container" width="100%">
<div bind:this={container} class="container" style="width: 100%; max-width: 1000px; margin: auto;"/>
</div>

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
		<input type='number' bind:value={rotateIndex} />
		<button on:click={rotateLeft}>ROTATE LEFT</button>
	</div>
	<div>
		<button on:click={runAnimations}>ANIMATE</button>
	</div>
</div>
</div>
