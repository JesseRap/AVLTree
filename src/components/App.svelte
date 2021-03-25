<style>
</style>
<script>
	import anime from 'animejs/lib/anime.es.js';

	import { afterUpdate, onMount, tick } from 'svelte';
	import { writable } from 'svelte/store';
	import AVLTree from '../lib/AVLTree.js';
	import TreeRenderer from '../lib/TreeRenderer.js';
	import Node from './Node.svelte';
	import NodeEdgeCircle from './NodeEdgeCircle.svelte';
	import MainSVG from './MainSVG.svelte';
	import Buttons from './Buttons.svelte'
	import Header from './Header.svelte';
	import { createSVGElement } from '../utils/svg';
	import { getCxArr, getCyArr } from '../utils/tree';

	// let svgContainer; // The container for the AVL SVG.

	const XMLNS = 'http://www.w3.org/2000/svg';


	$: renderer = null;
	$: stateGroups = renderer?.stateGroups || [];

	const notes = writable([]);

	const resetNotes = () => {
		notes.set([]);
	};

	$: {
		console.log('STATE GROUPS', stateGroups);
	}

	onMount(() => {
		// Create root SVG.
		const svg = document.getElementById('svg-main');

		renderer = new TreeRenderer(svg, notes);
		renderer = renderer;
	});
</script>

<div style="display: flex; flex-direction: column;">

	<Header />

	<div class="container-container" width="100%">

		<div class="container">
			<Buttons {renderer} {notes} {resetNotes} />
			<MainSVG {notes} />
		</div>

	</div>
</div>
