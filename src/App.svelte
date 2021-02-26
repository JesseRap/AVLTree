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
	let tree;
	let svg;
	let svgHeap = new Array(0);
	let parentArray = new Array(0);


	let edgeMatrix = {};

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

	const updateCxArr = tree => {
		if (!tree.root) return new Array(0);
		const levels = tree.getLevels();
		const result = levels.reduce((acc, level, index) => {
			const cxInc = 1 / Math.pow(2, index) * 100;
			return [...acc, ...level.map((_, idx) => (cxInc / 2) + (cxInc * idx))];
		}, []);
		console.log('CXARR', result);
		return result;
	};

	const updateCyArr = tree => {
		if (!tree.root) return new Array(0);
		// vertical space between nodes.
		const cyInc = 1 / (tree.root.height + 1) * 100;
		// vertical offset for current node.
		const levels = tree.getLevels();
		const result = levels.reduce((acc, level, index) => (
			[...acc, ...level.map(_ => (cyInc / 2) + (cyInc * index))]
		), []);
		console.log('CYARR', result);
		return result;
	};

	const updateSVGHeap = tree => {
		if (!tree.root) return new Array(0);
		const heap = tree.getHeap();
		console.log("HEAP", heap);
		svgHeap = heap.map((node, index) => {
			if (!node) return null;
			return svgHeap.find(el => el?.id === String(node.id)) || createNodeSVG(node, index);
		});
	}

	const rotateLeft = () => {
		tree.root = tree.rotateLeft(tree.root);
		updateSvg();
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

	const updateEdgeMatrix = tree => {
		if (!tree.root) return [];
		// const heap = tree.getHeap();
		for (let i = svgHeap.length - 1; i <= 0; i--) {
			if (svgHeap[i] && svgHeap[parentArray[i]]) {
				edgeMatrix[i] = parentArray[i];
			}
		}
		console.log("EDGE MATRIX", edgeMatrix)
	}

	const createNodeSVG = (node, index) => {
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

	const removeOldNodes = () => {
		const heap = tree.getHeap();
		for (let i = 0; i < heap.length; i++) {
			for (let j = 0; j < svgHeap.length; j++) {
				if (heap[i] === null) {
					if (svgHeap[i]) {
						svgHeap[i].innerHTML = '';
					}
					svgHeap[i] = null;
				}
			}
		}
	};

	const swapRightRecursive = (heap, index) => {
		while (heap[index * 2 + 1]) {
			swap(heap, index, index * 2 + 2);
		}
	};

	const rotateRootGroupLeft = () => {
		console.log('rotateRootGroupLeft');
		console.log(tree.toHeapString());
		tree.root = tree.rotateLeft(tree.root);
		console.log(tree.toHeapString());

		// swap(heap, index, index * 2 +  1);
		// swapRightRecursive(svgHeap, index
		// );
		// console.log("hi", svgHeap);
		// switch around elements in heaps
		// switch parent pointers
		//
	};

	const appendChildrenToParents = (tree) => {
		if (!tree.root) {
			Array.from(svg.children).forEach(child => {
				svg.removeChild(child);
			});
			return;
		}
		const heap = tree.getHeap();



		console.log('appendChildrenToParents', parentArray, svgHeap);
		svgHeap.forEach((group, index) => {
			if (!group) {
				return;
			}
			Array.from(svg.children).forEach(child => {
			})
			if (group && !Array.from(svg.children).some(child => {
				return child.id === group.id
			})) {
				console.log('APPEND CHILD');
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

	const updateNodeCoords = (tree) => {
		// console.log('updateNodeCoords')
		svgHeap.forEach((group, index) => {
			// console.log(group, index);
			if (group) {
				const circle = Array.from(group.children).find(g => g.tagName === 'circle');
				anime({
					targets: circle,
					translateX: `${cxArr[index]}%`,
					translateY: `${cyArr[index]}%`,
					duration: circle.getAttributeNS(null, 'translateX') === null ? 0 : 100
				});

				const text = Array.from(group.children).find(g => g.tagName === 'text' && g.getAttribute('class') !== 'balance');
				const heap = tree.getHeap();
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

	const edgesMemo = {};
	const drawEdges = tree => {
		const heap = tree.getHeap();
		for (let i = 0; i < svgHeap.length; i++) {
			if (edgesMemo[i]) {
				// const heap = tree.getHeap();
				// if (!heap[i]) {
				// 	svgHeap[i] = null;
				// 	parentArray[i] = null;
				// 	edgesMemo[i][parentArray[i]] = null;
				// 	continue;
				// }
				const path = edgesMemo[i];
				console.log(tree.toHeapString());
				path.setAttributeNS(null, 'd', `M ${cxArr[i]} ${cyArr[i]} L ${cxArr[parentArray[i]]} ${cyArr[parentArray[i]]}`);
				if (!heap[i] && edgesMemo[i]) {
					svg.removeChild(path);
				}
			}
			if (heap[i] && heap[parentArray[i]]) {
				if (edgesMemo?.[i]) {
					// const heap = tree.getHeap();
					// if (!heap[i]) {
					// 	svgHeap[i] = null;
					// 	parentArray[i] = null;
					// 	edgesMemo[i][parentArray[i]] = null;
					// 	continue;
					// }
					// const path = edgesMemo[i];
					// console.log(tree.toHeapString());
					// path.setAttributeNS(null, 'd', `M ${cxArr[i]} ${cyArr[i]} L ${cxArr[parentArray[i]]} ${cyArr[parentArray[i]]}`);
				} else {
					const path = document.createElementNS(XMLNS, 'path');
					path.setAttribute('id', `${i}-${parentArray[i]}`);
					path.setAttributeNS(null, 'd', `M ${cxArr[i]} ${cyArr[i]} L ${cxArr[parentArray[i]]} ${cyArr[parentArray[i]]}`);
					path.setAttributeNS(null, "stroke", "black");
					path.setAttributeNS(null, "fill", "transparent");
					// const strokeDashArray = Math.sqrt(Math.pow(Math.abs(cxArr[i] - cxArr[parentArray[i]]), 2) + Math.pow(Math.abs(cyArr[i] - cyArr[parentArray[i]]), 2));
					path.setAttributeNS(null, 'stroke-dasharray', '100');
					path.setAttributeNS(null, 'stroke-dashoffset', '-100%');
					svg.append(path);
					anime({
						targets: path,
						'stroke-dashoffset': '0%',
						duration: 1,
						delay: 1000
					});
					// path.setAttributeNS(null, 'stroke-dashoffset', '0%');
					edgesMemo[i] = path;
					console.log('edgesMemo', edgesMemo);
				}
			} else {
				delete edgesMemo[i];
			}
		}
	};

	const updateSvg = () => {
		// const temp = svg;
		// svg = tree.renderTree();
		// container.replaceChild(svg, temp);
		// console.log('cyArr prev', cyArr);
		cyArr = updateCyArr(tree);
		// console.log('cyArr post', cyArr);

		// console.log('cxArr prev', cxArr);
		cxArr = updateCxArr(tree);
		// console.log('cxArr post', cxArr);
		updateSVGHeap(tree);
		removeOldNodes();
		updateParentArray(tree);
		updateNodeCoords(tree);
		appendChildrenToParents(tree);
		// updateEdgeMatrix(tree);
		drawEdges(tree);
		// renderTree();
		console.log("HEAP STRING", tree.toHeapString())
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

	const onInsertRandVal = () => {
		let randVal = Math.floor(Math.random() * 50);
		if (edgesMemo[randVal]) {
			randVal = Math.floor(Math.random() * 50);
		}
		console.log('onInsertRandVal *!@#!&@#&*', randVal);
		// tree.insert(randVal);
		tree.insert(randVal);
		updateSvg();
	}

	const onReset = () => {
		tree = new AVLTree();
		updateSvg();
	}

	onMount(() => {
		tree = new AVLTree();

		console.log('root', tree.root);

		svg = createSVGElement();

		// tree.insert(9);
		// tree.insert(12);
		// tree.insert(43);

		console.log('svgHeap', svgHeap)

		container.appendChild(svg);
		updateSvg();

		console.log('svgHeap', svgHeap);

		// rotateRootGroupLeft();

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
		<button on:click={rotateLeft}>ROTATE LEFT</button>
	</div>
</div>
