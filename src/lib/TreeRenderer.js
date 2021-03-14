import AVLTree from './AVLTree.js';
import Node from '../components/Node.svelte';
import { childExistsInNode, createNodeSVG } from '../utils/svg';

const XMLNS = 'http://www.w3.org/2000/svg';

export default class TreeRenderer {
  cxArr = [];
  cyArr = [];
  svgHeap = [];
  edgeMemo = {};
  stateGroups = [];
  tree;
  rootSVG;

  constructor(svg, copy = true){
    this.tree = new AVLTree();
    this.rootSVG = svg;
    if (copy) {
      this.stateGroup = [{
        type: 'initial',
        tree: this.tree.copy()
      }];
      this.stateGroups.push(this.stateGroup);
    }
  }

  insert = val => {
    debugger;
    console.log('insert');
    this.tree.insert(val);
    this.stateGroups = [...this.stateGroups, this.tree.stateGroup];
    this.runLatestAnimationGroup();
  };

  find = val => {
    console.log('find');
    this.tree.find(val);
    this.stateGroups = [...this.stateGroups, this.tree.stateGroup];
  };

  delete = val => {
    console.log('delete');
    this.tree.insert(val);
    this.stateGroups = [...this.stateGroups, this.tree.stateGroup];
  };

  reset = () => {
    console.log('reset');
    this.svgHeap = [];
    this.edgeMemo = {};
    this.stateGroups = [...this.stateGroups, this.tree.stateGroup];
  };


	// removeOldNodes = () => {
	// 	for (let i = 0; i < this.svgHeap.length; i++) {
	// 		if (this.svgHeap[i] && this.tree.heap[i] === null) {
	// 			this.rootSVG.removeChild(this.svgHeap[i]);
	// 			this.svgHeap[i] = null;
	// 		}
	// 	}
	// };

  removeAllChildrenFromSVG = () => {
		Array.from(this.rootSVG.children).forEach(child => {
			// TODO: Brittle. Meant to not delete the edge circle.
			if (child.tagName === 'g' || child.tagName === 'path' ) {
				this.rootSVG.removeChild(child);
			}
		});
	};

  animateUpdateNodeCoords = () => {
		this.svgHeap.forEach((group, index) => {
			if (group) {
				console.log("GROUP", JSON.stringify(group.style.transform), group.id)
				anime({
					targets: group,
					translateX: `${this.cxArr[index]}%`,
					translateY: `${this.cyArr[index]}%`,
					duration: group.style.transform === "" ? 0 : 1000,
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

  createPath = node => {
    debugger;
		if (!node) return;
		const i = this.getNodeIndex(node);
		if (i === 0) return;
		if (i === -1) throw new Error('Node not found.');
		const nodeId = node.id;
		const parent = this.getParentNode(node);
		const parentId = parent.id;
		const path = document.createElementNS(XMLNS, 'path');
		path.classList.add('edge-circle');
		const pathId = `${nodeId}-${parentId}`
		path.setAttribute('id', pathId);
		path.setAttributeNS(null, 'filter', 'url(#edgeBlur)');
		path.setAttributeNS(null, 'd', `M ${this.cxArr[i]} ${this.cyArr[i]} L ${this.cxArr[this.tree.parentArray[i]]} ${this.cyArr[this.tree.parentArray[i]]}`);
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

  animateDrawEdges = tree => {
    debugger;
		const heap = tree.heap;

		const keys = [];

		for (let i = 0; i < heap.length; i++) {
			const node = heap[i];
			if (i === 0 || !node) continue;
			const parent = tree.getParentNode(node);
			const nodeId = node.id;
			const parentId = parent.id;
			const key = `${nodeId}-${parentId}`;
			keys.push(key);
			console.log("KEY", key)
			console.log("this.edgesMemo", tree.edgesMemo)
			console.log("svgHeap", svgHeap)
			if (this.edgesMemo[key]) {
				const path = this.edgesMemo[key];
				// if (path && !heap[i]) {
				// 	svg.removeChild(path);
				// 	delete tree.edgesMemo[i];
				// }
				path.setAttributeNS(null, 'd', `M ${tree.cxArr[i]} ${tree.cyArr[i]} L ${cxArr[tree.tree.parentArray[i]]} ${tree.cyArr[tree.tree.parentArray[i]]}`);
				// if (!heap[i] && tree.edgesMemo[i]) {
				// 	svg.removeChild(path);
				// }
			} else {
				console.log('NEW PATH');
        debugger;
				const path = this.createPath(node);
				const firstNode = tree.rootSVG.children[0];
				this.rootSVG.insertBefore(path, firstNode);
				path.setAttributeNS(null, 'd', `M ${tree.cxArr[i]} ${tree.cyArr[i]} L ${tree.cxArr[tree.tree.parentArray[i]]} ${tree.cyArr[tree.tree.parentArray[i]]}`);
				// path.setAttributeNS(null, 'stroke-dashoffset', '0%');
				path.setAttributeNS(null, 'stroke-dashoffset', '-100%');
				anime({
					targets: path,
					'stroke-dashoffset': '0%',
					duration: 500,
					delay: 200
				});
				this.edgesMemo[key] = path;
			}
		}

    // // remove old edges
		// Object.keys(this.edgesMemo).forEach(key => {
		// 	if (!keys.includes(key)) {
		// 		anime({
		// 			targets: this.edgesMemo[key],
		// 			opacity: 0,
		// 			duration: 500,
		// 			delay: 1000
		// 		});
		// 		const path = this.edgesMemo[key];
		// 		setTimeout(() => {
		// 			svg.removeChild(path);
		// 		}, 1000);
		// 		delete tree.edgesMemo[key];
		// 	}
		// });
	};

  /**
   * Updates the edge memp based on the AVL tree after changes.
   */
  updateEdgeMemoFromState = state => {
    console.log('updateEdgeMemoFromState');
    if (!state.tree.root) {
      this.edgeMemo = {};
		} else if (state.type === 'insert') {
      const { pivot, rotated, parent } = state;
      const key = `${child.id}-${parent.id}`;

      this.edgeMemo[key] = this.createPath(child);
    } else if (state.type === 'rebalance') {
      const oldKey = `${pivot.id}-${rotated.id}`;
      const newKey = `${rotated.id}-${pivot.id}`;
      const path = this.edgeMemo[oldKey];
      this.edgeMemo[newKey] = path;
      delete this.edgeMemo[oldKey];
      path.setAttribute('id', newKey);

      if (parent) {
        const oldParentKey = `${parent.id}-${rotated.id}`;
        const newParentKey = `${parent.id}-${rotated.id}`;
        const path = this.edgeMemo[oldKey];
        this.edgeMemo[newKey] = path;
        delete this.edgeMemo[oldKey];
        path.setAttribute('id', newParentKey);
      }

      const pivotIndex = this.getNodeIndex(pivot);
      const pivotIsLeftChild = pivotIndex % 2 === 1;
      const otherNode = pivot[pivotIsLeftChild ? 'right' : 'left'];
      if (otherNode) {
        const oldKey = `${otherNode.id}-${rotated.id}`;
        const newKey = `${otherNode.id}-${pivot.id}`;
        const path = this.edgeMemo[oldKey];
        this.edgeMemo[newVal] = path;
        delete this.edgeMemo[oldKey];
        path.setAttribute('id', newKey);
      }
    } else if (state.type === 'delete') {

    }
  };

  /**
   * Updates the SVG heap based on the AVL tree after changes.
   */
  updateSvgHeapFromHeap = tree => {
    console.log('updateSvgHeapFromHeap');
    if (!tree.root) {
      this.svgHeap = [];
			return;
		}
    console.log('svgHeap', this.svgHeap);
    console.log('treeHeap', tree.heap);
    this.svgHeap = tree.heap.map(node => {
      if (!node) return null;
      return tree.heap.find(el => el?.id === `g-${node.id}`) || createNodeSVG(node);
    });
  };

  insertNewNodesIntoSVG = state => {
    state.tree.heap.forEach((node, index) => {
      if (node && !Array.from(state.rootSVG.children).includes(child => child?.id === `g-${node.id}`)) {
        const group = createNodeSVG(node);
        this.rootSVG.appendChild(group);
        anime({
          targets: group,
          translateX: `${this.cxArr[index]}%`,
          translateY: `${this.cyArr[index]}%`,
          duration: group.style.transform === "" ? 0 : 1000,
        });
      }
    })
  };

  update = state => {
    console.log('update state');
    this.updateSvgHeapFromHeap(state.tree);
    this.updateEdgeMemoFromState(state);
  };

  animate = state => {
    console.log('animate state');
    this.update(state);
    this.insertNewNodesIntoSVG(state);
    this.animateUpdateNodeCoords();
    this.animateDrawEdges(state.tree);
  };

  runLatestAnimationGroup = () => {
    console.log('runLatestAnimationGroup', this.stateGroups);
    for (const state of this.stateGroups[this.stateGroups.length - 1]) {
      console.log(state);
      this.update(state);
      this.animate(state);
    }
  };
}
