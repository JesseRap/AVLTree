<script>
	import anime from 'animejs/lib/anime.es.js';

	import { afterUpdate, onMount, tick } from 'svelte';
	import AVLTree from './AVLTree.js';
	// import SVGTree from './SVGTree.svelte';
	// import Tree from './Tree.svelte';
	let name = 'world';
	let container;

	let groupId = 0;

	const XMLNS = 'http://www.w3.org/2000/svg';

	let child;
	let theTree = new AVLTree();
	let svg;
	let svgHeap = new Array(0);
	let parentArray = new Array(0);
	let rotateIndex = 0;

 	$: states = theTree.states;

	$: {
		console.log('STATES!!!!!', states);
	}


	let cxArr = [];
	let cyArr = [];

	const createSVGElement = () => {
		const svg = document.createElementNS(XMLNS, 'svg');
    svg.setAttributeNS(null, 'width', '100%');
    svg.setAttributeNS(null, 'height', '100%');
    svg.style.border = '1px solid black';
    svg.setAttribute('class', 'svg-main');
    svg.setAttributeNS(null, 'viewBox', '0 0 100 100');
		return svg;
	};

	const getCxArr = tree => {
		if (!tree.root) return new Array(0);
		const levels = tree.getLevels();
		const result = levels.reduce((acc, level, index) => {
			const cxInc = 1 / Math.pow(2, index) * 100;
			return [...acc, ...level.map((_, idx) => (cxInc / 2) + (cxInc * idx))];
		}, []);
		// console.log('CXARR', result);
		return result;
	};

	const getCyArr = tree => {
		if (!tree.root) return new Array(0);
		// vertical space between nodes.
		const cyInc = 1 / (tree.root.height + 1) * 100;
		// vertical offset for current node.
		const levels = tree.getLevels();
		const result = levels.reduce((acc, level, index) => (
			[...acc, ...level.map(_ => (cyInc / 2) + (cyInc * index))]
		), []);
		// console.log('CYARR', result);
		return result;
	};

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

	const updateParentArray = tree => {
		if (!tree.root) return [];
		 // TODO: make so it doesn't replace entity.
		 parentArray = svgHeap.map((_, index) => {
			 if (index === 0) {
				 return null;
			 } else {
				 return Math.floor((index - 1) / 2);
			 }
		 });
	};

	const swap = (arr, i1, i2) => {
		const temp = arr[i1];
		arr[i1] = arr[i2];
		arr[i2] = temp
	};

	const createNodeSVG = node => {
		console.log('createNodeSVG!!');

		const g = document.createElementNS(XMLNS, 'g');
		g.id = String(node.id);
		// g.id = String(groupId++);
		const circle = document.createElementNS(XMLNS, 'circle');
		circle.setAttributeNS(null, 'cx', '0');
		circle.setAttributeNS(null, 'cy', '0');
		circle.setAttributeNS(null, 'r', '5');
		circle.setAttributeNS(null, 'fill', 'red');
		g.appendChild(circle);

		const text = document.createElementNS(XMLNS, 'text');
		text.setAttributeNS(null, 'x', '0');
		text.setAttributeNS(null, 'y', '0');
		text.setAttribute('font-size', '5px');
		text.innerHTML = String(node.val);

		const balance = document.createElementNS(XMLNS, 'text');
		balance.setAttributeNS(null, 'x', '0');
		balance.setAttributeNS(null, 'y', '10');
		balance.setAttribute('font-size', '5px');
		balance.setAttribute('class', 'balance');
		balance.innerHTML = String(node.balance);

		g.appendChild(text);
		g.appendChild(balance);
		return g;
	};

	const removeOldNodes = (tree) => {
		const heap = tree.heap;
		for (let i = 0; i < Math.max(heap.length, svgHeap.length); i++) {
			for (let j = 0; j < Math.max(svgHeap.length, heap.length); j++) {
				if (heap[i] === null && i < svgHeap.length) {
					svgHeap[i] = null;
				}
			}
		}
	};

	const appendChildrenToParents = (tree) => {
		if (!tree.root) {
			Array.from(svg.children).forEach(child => {
				svg.removeChild(child);
			});
			return;
		}
		const heap = tree.heap;



		svgHeap.forEach((group, index) => {
			if (!group) {
				return;
			}
			Array.from(svg.children).forEach(child => {
			})
			if (group && !Array.from(svg.children).some(child => {
				return child.id === group.id
			})) {
				svg.appendChild(group);
			}
		})
	};

	const getHeapSubtreeIndices = (heap, index) => {
		if (index > heap.length / 2) {
			return [];
		}
		return [heap[index], ...getHeapSubtreeIndices(heap, index * 2), ...getHeapSubtreeIndices(heap, index * 2 + 1)];
	};

	const updateNodeCoords = tree => {
		if (!tree.root) svgHeap = [];
		svgHeap.forEach((group, index) => {
			if (group) {
				const circle = Array.from(group.children).find(g => g.tagName === 'circle');
				anime({
					targets: circle,
					translateX: `${cxArr[index]}%`,
					translateY: `${cyArr[index]}%`,
					duration: circle.getAttributeNS(null, 'translateX') === null ? 0 : 100
				});

				const text = Array.from(group.children).find(g => g.tagName === 'text' && g.getAttribute('class') !== 'balance');
				const heap = tree.heap;
				text.innerHTML = heap[index].val;
				anime({
					targets: text,
					translateX: `${cxArr[index]}%`,
					translateY: `${cyArr[index]}%`,
					duration: text.getAttributeNS(null, 'translateX') === null ? 0 : 2000
				});

				const balance = Array.from(group.children).find(g => g.tagName === 'text' && g.getAttribute('class') === 'balance');
				balance.innerHTML = heap[index].balance;
				anime({
					targets: balance,
					translateX: `${cxArr[index]}%`,
					translateY: `${cyArr[index] + 5}%`,
					duration: balance.getAttributeNS(null, 'translateX') === null ? 0 : 2000
				});
			}
		});
	};

	const createPath = (tree, node) => {
		if (!node) return;
		const i = tree.getNodeIndex(node);
		if (i === 0) return;
		const nodeId = node.id;
		const parent = i === 0 ? null : tree.heap[Math.floor((i - 1) / 2)];
		const parentId = parent.id;
		const path = document.createElementNS(XMLNS, 'path');
		const pathId = `${nodeId}-${parentId}`
		path.setAttribute('id', pathId);
		path.setAttributeNS(null, 'd', `M ${cxArr[i]} ${cyArr[i]} L ${cxArr[parentArray[i]]} ${cyArr[parentArray[i]]}`);
		path.setAttributeNS(null, "stroke", "black");
		path.setAttributeNS(null, "fill", "transparent");
		path.setAttributeNS(null, 'stroke-dasharray', '100');
		path.setAttributeNS(null, 'stroke-dashoffset', '-100%');
		return path;
	};

	const updateEdgesMemo = (tree, memp) => {
		if (!tree.root) return new Array(0);
		const heap = tree.heap;
		heap.forEach((node, index) => {
			const nodeId = node.id;
			const parent = index === 0 ? null : heap[Math.floor((index - 1) /  2)];
			const parentId = parent.id;
			const pathId = `${nodeId}-${parentId}`;
			if (edgesMemo[pathId]) {
				const path = edgesMemo[pathId];
				path.setAttributeNS(null, 'd', `M ${cxArr[index]} ${cyArr[index]} L ${cxArr[parentArray[index]]} ${cyArr[parentArray[index]]}`);
			} else {
				const path = createPath(tree, heap[index]);
				edgesMemo[pathId] = path;
				svg.append(path);
				anime({
					targets: path,
					'stroke-dashoffset': '0%',
					duration: 1,
					delay: 1000
				});
			}
		});
	}

	let edgesMemo = {};
	const drawEdges = tree => {
		const heap = tree.heap;
		for (let i = 0; i < svgHeap.length; i++) {
			if (edgesMemo[i]) {
				const path = edgesMemo[i];
				if (path && !heap[i]) {
					svg.removeChild(path);
					delete edgesMemo[i];
				}
				path.setAttributeNS(null, 'd', `M ${cxArr[i]} ${cyArr[i]} L ${cxArr[parentArray[i]]} ${cyArr[parentArray[i]]}`);
				if (!heap[i] && edgesMemo[i]) {
					svg.removeChild(path);
				}
			}
			if (heap[i] && heap[parentArray[i]]) {
				if (!edgesMemo?.[i]) {
					const path = createPath(tree, heap[i]);
					svg.append(path);
					anime({
						targets: path,
						'stroke-dashoffset': '0%',
						duration: 1,
						delay: 1000
					});
					// path.setAttributeNS(null, 'stroke-dashoffset', '0%');
					edgesMemo[i] = path;
				}
			} else {
				delete edgesMemo[i];
			}
		}
	};

	const updateSvg = (t) => {
		const myTree = t || theTree;
		console.log('updateSvg', myTree, cxArr, cyArr)
		// const temp = svg;
		// svg = myTree.renderTree();
		// container.replaceChild(svg, temp);
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
		console.log('updateParentArray');
		updateParentArray(myTree);
		console.log('drawEdges');
		drawEdges(myTree);
		console.log('updateNodeCoords');
		updateNodeCoords(myTree);
		console.log('appendChildrenToParents');
		appendChildrenToParents(myTree);
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
		updateSvg(theTree);
	};

	let findVal = null;
	const onFindValue = () => {
		console.log("FINDVAL", findVal)
		theTree.find(findVal);
	};

	const wait = ms => new Promise(res => setTimeout(res, ms));

	const runAnimation = async index => {
		console.log('runAnimation', states);
		// edgesMemo = {};
		for (let i = 0; i < states[index].length; i++) {
			// edgesMemo = {};
			updateSvg(states[index][i].tree);
			// await tick();
			await wait(1000);
		}
	};

	const runAnimations = async () => {
		console.log('runAnimations', states);
		// updateSvg(states[0][0].tree);
		// await wait(1000);
		// updateSvg(states[1][0].tree);
		// await wait(1000);
		// updateSvg(states[2][0].tree);
		for (let i = 0; i < states.length; i++) {
			await runAnimation(i);
		}
		// updateSvg(states[0][0].tree);
		// edgesMemo = {};
		// let t = states[0][0].tree
		// updateSvg(t)
		// edgesMemo = {};
		// updateSvg(states[1][0].tree);
		// edgesMemo = {};
		// t = states[0][0].tree
		// updateSvg(t)
		// edgesMemo = {};
		// updateSvg(states[2][0].tree);
	};

	const onInsertRandVal = () => {
		let randVal = Math.floor(Math.random() * 50);
		if (edgesMemo[randVal]) {
			randVal = Math.floor(Math.random() * 50);
		}
		console.log('onInsertRandVal *!@#!&@#&*', randVal);
		theTree.insert(randVal);
		// tree.insertUnbalanced(randVal);
		theTree = theTree;
		updateSvg(theTree);
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

		console.log('svgHeap', svgHeap)

		container.appendChild(svg);
		updateSvg(theTree);

		console.log('svgHeap', svgHeap);

	});
</script>

<h1 class="hello">Hello {name}!</h1>

<div bind:this={container} style="width: 600px; height: 600px; margin: auto;"/>

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
