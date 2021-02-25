<script>
	import anime from 'animejs/lib/anime.es.js';

	import { afterUpdate, onMount, tick } from 'svelte';
	import AVLTree from './AVLTree.js';
	import SVGTree from './SVGTree.svelte';
	import Tree from './Tree.svelte';
	let name = 'world';
	let container;

	const XMLNS = 'http://www.w3.org/2000/svg';

	let child;
	let tree;
	let svg;
	let svgHeap = new Array(0);
	let parentArray = new Array(0);

	const cxArr = [];
	const cyArr = [];

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
		console.log(levels);
		const newCxArry = levels.reduce((acc, level, index) => {
			const cxInc = 1 / Math.pow(2, index) * 100;
			console.log('cxInc', cxInc)
			return [...acc, ...level.map((_, idx) => (cxInc / 2) + (cxInc * idx))];
		}, []);
		console.log('newCxArry', newCxArry);
		newCxArry.forEach((val, index) => {
			cxArr[index] = val;
		})
		console.log('CXARR', cxArr);
	};

	const updateCyArr = tree => {
		if (!tree.root) return new Array(0);
		// vertical space between nodes.
		const cyInc = 1 / (tree.root.height + 1) * 100;
		// vertical offset for current node.
		const levels = tree.getLevels();
		const newCyArr = levels.reduce((acc, level, index) => (
			[...acc, ...level.map(_ => (cyInc / 2) + (cyInc * index))]
		), []);
		newCyArr.forEach((val, index) => {
			cyArr[index] = val;
		})
		console.log('CYARR', cyArr);
	};

	const updateSVGHeap = tree => {
		if (!tree.root) return new Array(0);
		const heap = tree.getHeap();
		console.log("HEAP", heap);
		svgHeap = heap.map((node, index) => node ? svgHeap[index] ? svgHeap[index] : createNodeSVG(node, index) : null);
	}

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

	const createNodeSVG = (node, index) => {

		const g = document.createElementNS(XMLNS, 'g');
		const circle = document.createElementNS(XMLNS, 'circle');
		circle.setAttributeNS(null, 'cx', cxArr[index]);
		circle.setAttributeNS(null, 'cy', cyArr[index]);
		circle.setAttributeNS(null, 'r', '5');
		circle.setAttributeNS(null, 'fill', 'red');
		g.appendChild(circle);

		const text = document.createElementNS(XMLNS, 'text');
		text.setAttributeNS(null, 'x', cxArr[index]);
		text.setAttributeNS(null, 'y', cyArr[index]);
		text.innerHTML = String(node.val);

		g.appendChild(text);
		return g;
	};

	const appendChildrenToParents = () => {
		console.log('appendChildrenToParents', parentArray, svgHeap);
		if (svgHeap.length === 1) {
			if (svgHeap[0]) {
				svg.appendChild(svgHeap[0]);
			}
			return;
		}
		for (let i = svgHeap.length - 1; i >= 0; i--) {
			if (parentArray[i] !== null && svgHeap[parentArray[i]] !== null && svgHeap[i] !== null) {
				svgHeap[parentArray[i]].appendChild(svgHeap[i]);
			}
		}
		console.log(svgHeap);
	};

	const renderTree = () => {
		const heap = tree.getHeap();
		console.log("HEAP", heap);
		if (heap.length === 0) {
			svg = createSVGElement();
			svgHeap[0] = createSVGElement();
			return;
		}
		const SVGHeap = heap.map((node, index) => {
			if (node) {
				return createNodeSVG(node, index);
			} else {
				return null;
			}
		});

		console.log("SVGHeap", SVGHeap)
		SVGHeap.forEach((el, index) => {
			console.log('here', el, index)
			if (SVGHeap[index] !== null) {
				const parent = SVGHeap[Math.floor(index / 2)];
				parent.appendChild(SVGHeap[index]);
			}
		});

		svg = SVGHeap[0];

		// updateSvg();

		// getLevels()
		// flatten the levels (i.e., heap)
		// map each element to a NodeSVG
		// set cx and cy based on cxArr and cyArr
		// forEach over heap and append children to parents
		// parent(i) = Math.floor(i / 2)
		// if heap[i] !== null, heap[parent(i)].appendChild()
	};

	onMount(() => {
		tree = new AVLTree();

		// console.log(tree.toString());
		console.log('root', tree.root);

		// tree.insert(1)
		// console.log(tree.toString());
		// console.log(tree.root);
		//
		// tree.insert(3)
		// console.log(tree.toString());
		// console.log(tree.root);

		svg = createSVGElement();

		// svg = tree.renderTree();
		// renderTree();
		container.appendChild(svg);
		updateSvg();
	});

	const updateSvg = () => {
		const temp = svg;
		// svg = tree.renderTree();
		// container.replaceChild(svg, temp);
		updateCyArr(tree);
		updateCxArr(tree);
		updateSVGHeap(tree);
		updateParentArray(tree);
		appendChildrenToParents();
		// renderTree();
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
		const randVal = Math.floor(Math.random() * 50);
		console.log('onInsertRandVal', randVal);
		tree.insert(randVal);
		updateSvg();
	}

	const onReset = () => {
		tree = new AVLTree();
		updateSvg();
	}
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
</div>
