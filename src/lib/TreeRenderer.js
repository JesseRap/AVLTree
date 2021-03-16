import anime from 'animejs/lib/anime.es.js';
import AVLTree from './AVLTree.js';
import Node from '../components/Node.svelte';
import NodeEdgeCircle from '../components/NodeEdgeCircle.svelte';
import { childExistsInNode, createNodeSVG } from '../utils/svg';
import { getCxArr, getCyArr } from '../utils/tree';
import { wait } from '../utils';

const XMLNS = 'http://www.w3.org/2000/svg';

export default class TreeRenderer {
  cxArr = [];
  cyArr = [];
  svgHeap = [];
  edgeMemo = {};
  tree;
  rootSVG;

  constructor(svg) {
    this.tree = new AVLTree();
    this.rootSVG = svg;
  }

  get stateGroups() {
    return this.tree?.stateGroups ?? [];
  };

  insert = val => {
    // debugger;
    console.log('insert');
    this.tree.insert(val);
    this.tree = this.tree;
    this.clearAllVisitedNodes();
    // this.runLatestAnimationGroup();
  };

  find = val => {
    console.log('find');
    this.tree.find(val);
    this.tree = this.tree;
  };

  delete = val => {
    console.log('delete');
    this.tree.insert(val);
    this.tree = this.tree;
  };

  reset = () => {
    console.log('reset');
    this.svgHeap = [];
    this.edgeMemo = {};
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

  animateUpdateNodeCoords = state => {
		this.svgHeap.forEach((group, index) => {
			if (group) {
				console.log("GROUP", JSON.stringify(group.style.transform), group.id, this.cxArr, this.cyArr);
				anime({
					targets: group,
					translateX: `${this.cxArr[index]}%`,
					translateY: `${this.cyArr[index]}%`,
					duration: group.style.transform === "" ? 0 : 1000,
				});

				// group.style.transform = `translate(${cxArr[index]}%, ${cyArr[index]}%)`;

				const balance = group.querySelector('.balance');
				const heap = this.tree.heap;
				balance.innerHTML = state.tree.heap[index].balance;
				balance.setAttributeNS(null, 'fill', (Math.abs(state.tree.heap[index].balance)) === 0 ? '#7f8fa6' : (Math.abs(state.tree.heap[index].balance)) === 1 ? '#c23616' : '#e84118');

				const balanceLineGroup = group.querySelector('.balance-line-group');
				balanceLineGroup.setAttribute('style', state.tree.heap[index].balance === 0 ? 'transform: rotate(0);' : state.tree.heap[index].balance === 1 ? 'transform: rotate(7deg);' : 'transform: rotate(-7deg)');

				const balanceNumberGroup = group.querySelector('.balance-number-group');
				balanceNumberGroup.setAttribute('style', state.tree.heap[index].balance === 0 ? 'transform: translate(0, 0)' : state.tree.heap[index].balance === 1 ? 'transform: translate(20px, 5px);' : 'transform: translate(-20px, 5px)');

				if (Math.abs(state.tree.heap[index].balance) > 0) {
					balanceLineGroup.parentElement.classList.add('wobble');
				} else {
					balanceLineGroup.parentElement.classList.remove('wobble');
				}
			}
		});
	};

  createPath = node => {
    // debugger;
		if (!node) return;
		const i = this.tree.getNodeIndex(node);
		if (i === 0) return;
		if (i === -1) throw new Error('Node not found.');
		const nodeId = node.id;
		const parent = this.tree.getParentNode(node);
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
		path.setAttributeNS(null, 'stroke-dashoffset', '-100%');
		anime({
			targets: path,
			'stroke-dashoffset': '0%',
			duration: 500,
			delay: 0,
      easing: 'easeOutQuad'
		});
		return path;
	};

  animateDrawEdges = tree => {
    console.log('animateDrawEdges', tree)
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
			console.log("this.edgeMemo", this.edgeMemo)
			console.log("svgHeap", this.svgHeap)
			if (this.edgeMemo[key]) {
        console.log('update edge');
				const path = this.edgeMemo[key];
        if (!Array.from(this.rootSVG.children).find(g => g.id === path.id)) {
          this.rootSVG.append(path);
        }
				// if (path && !heap[i]) {
				// 	svg.removeChild(path);
				// 	delete tree.edgeMemo[i];
				// }
				path.setAttributeNS(null, 'd', `M ${this.cxArr[i]} ${this.cyArr[i]} L ${this.cxArr[this.tree.parentArray[i]]} ${this.cyArr[this.tree.parentArray[i]]}`);
				// if (!heap[i] && tree.edgeMemo[i]) {
				// 	svg.removeChild(path);
				// }
			} else {
        console.log('NOOO')
        debugger;
				const path = this.createPath(node);
        console.log('NEW PATH', path);
				const firstNode = this.rootSVG.children[0];
				this.rootSVG.insertBefore(path, firstNode);
				path.setAttributeNS(null, 'd', `M ${this.cxArr[i]} ${this.cyArr[i]} L ${this.cxArr[this.tree.parentArray[i]]} ${this.cyArr[this.tree.parentArray[i]]}`);
				// path.setAttributeNS(null, 'stroke-dashoffset', '0%');
				path.setAttributeNS(null, 'stroke-dashoffset', '-100%');
				anime({
					targets: path,
					'stroke-dashoffset': '0%',
					duration: 500,
					delay: 200
				});
				this.edgeMemo[key] = path;
			}
		}

    // // remove old edges
		// Object.keys(this.edgeMemo).forEach(key => {
		// 	if (!keys.includes(key)) {
		// 		anime({
		// 			targets: this.edgeMemo[key],
		// 			opacity: 0,
		// 			duration: 500,
		// 			delay: 1000
		// 		});
		// 		const path = this.edgeMemo[key];
		// 		setTimeout(() => {
		// 			svg.removeChild(path);
		// 		}, 1000);
		// 		delete tree.edgeMemo[key];
		// 	}
		// });
	};

  animateStart = async (value) => {
    const circle = document.getElementById('intro-group');

    const n = new Node({
      target: circle,
      props: {
        value,
        balance: 0,
        id: 'intro-node'
      }
    });

    const nodeGroup = document.getElementById('intro-node');

    anime({
      targets: nodeGroup,
      translateX: '13%',
      translateY: '18%',
      scale: 3,
      opacity: 1,
      duration: 0
    });

    anime({
      targets: circle,
      opacity: 1,
      duration: 1000,
      loop: 2,
      direction: 'alternate',
      easing: 'easeInOutQuad'
    });


    let startNode = document.getElementById('start-node');
    if (startNode) this.rootSvg.removeChild(startNode);
    // QUESTION: Need to await tick()?
    const newNode = new Node({
      target: this.rootSVG,
      props: {
        value,
        anchor: this.rootSVG.children[0],
        id: 'start-node',
        isFirstNode: true,
      }
    });
    console.log('newNode!', newNode);

    startNode = document.getElementById('start-node');
    const transformGroup = startNode.querySelector('.node-transform-group');
    const balanceGroup = startNode.querySelector('.balance-line-group');

    console.log('startNode!', startNode);
    console.log('balanceGroup!', balanceGroup);
    console.log('transformGroup!', transformGroup);

    transformGroup.setAttribute('style', 'opacity: 0');

    const timeline = anime.timeline();

    await wait(2000);

    timeline.add({
      targets: transformGroup,
      translateX: '15%',
      translateY: '15%',
      opacity: 1,
      duration: 0
    })
    .add({
      targets: transformGroup,
      translateX: `${this.cxArr[0] ?? 50}%`,
      translateY: `${this.cyArr[0] ?? 50}%`,
      opacity: 1,
      duration: 1000,
    }, '+=1000')
    .add({
      targets: startNode,
      opacity: 1,
      duration: 0,
      delay: 1000
    })
    // .add({
    //   targets: transformGroup,
    //   opacity: 0,
    //   duration: 1,
    //   delay: 200
    // });

    // startNode.setAttributeNS(null, 'cx', '20%');
    // startNode.setAttributeNS(null, 'cy', '20%');

    // applyScaleToAllBalances();
    // this.balanceScaleDown();
    // await wait(500);
    // this.updateSvg();
    // this.rootSvg.removeChild(startNode);
  };

  /**
   * Updates the edge memp based on the AVL tree after changes.
   */
  updateEdgeMemoFromState = async state => {
    debugger;
    console.log('updateEdgeMemoFromState');
    const { child, node, insertValue, newNode, pivot, rotated, parent } = state;
    if (!state.tree.root) {
      await this.animateStart(state.insertValue);
      this.edgeMemo = {};
		} else if (state.type === 'insert') {
      if (newNode.id !== child.id) {
        const key = `${newNode.id}-${child.id}`;
        this.edgeMemo[key] = this.createPath(newNode);
        console.log('EDGE MEMO', this.edgeMemo);
      }
    } else if (state.type === 'insertStart') {
      await this.animateStart(state.insertValue);
    } else if (state.type === 'visitNode') {
      const node = state.node;
      const svg = this.svgHeap.find(el => el?.id === `g-${node.id}`);
      svg.classList.add('visited-node');
      const nodeIndex = this.svgHeap.findIndex(el => el?.id === `g-${node.id}`);
      const parent = nodeIndex === 0 ? null : this.svgHeap[Math.floor((nodeIndex - 1) / 2)];
      debugger;
      const circle = svg.querySelector('circle');
      circle.setAttributeNS(null, 'fill', 'red');
      if (parent) {
        await this.animateEdge(state.tree, parent, node);
      }
    } else if (state.type === 'rebalance') {
      const oldKey = `${rotated.id}-${pivot.id}`;
      const newKey = `${pivot.id}-${rotated.id}`;
      const path = this.edgeMemo[oldKey];
      this.edgeMemo[newKey] = path;
      delete this.edgeMemo[oldKey];
      path.setAttribute('id', newKey);

      if (parent) {
        const oldParentKey = `${pivot.id}-${parent.id}`;
        const newParentKey = `${rotated.id}-${parent.id}`;
        const path = this.edgeMemo[oldKey];
        this.edgeMemo[newKey] = path;
        delete this.edgeMemo[oldKey];
        path.setAttribute('id', newParentKey);
      }

      const pivotIndex = this.tree.getNodeIndex(pivot);
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
      // debugger;
      return this.svgHeap.find(el => el?.id === `g-${node.id}`) || createNodeSVG(node);
    });
  };

  insertNewNodesIntoSVG = state => {
    // debugger;
    const rootSVG = this.rootSVG;
    state.tree.heap.forEach((node, index) => {
      if (node && !Array.from(rootSVG.children).includes(child => child?.id === `g-${node.id}`)) {
        // debugger;
        const group = createNodeSVG(node);
        rootSVG.appendChild(group);
        anime({
          targets: group,
          translateX: `${this.cxArr[index]}%`,
          translateY: `${this.cyArr[index]}%`,
          duration: group.style.transform === "" ? 0 : 1000,
        });
      }
    })
  };

  insertNodesIntoSVG = () => {
    for (const group of this.svgHeap) {
      if (!Array.from(this.rootSVG.children).includes(group)) {
        this.rootSVG.append(group);
      }
    }
  };

  insertEdgesIntoSVG = () => {
    for (const edge of Object.values(this.edgeMemo)) {
      if (!Array.from(this.rootSVG.children).includes(edge)) {
        this.rootSVG.append(edge);
      }
    }
  };

  updateCxArrAndCyArr = tree => {
    this.cxArr = getCxArr(tree);
    this.cyArr = getCyArr(tree);
  };

  clearAllVisitedNodes = () => {
    const visitedCircles = Array.from(document.querySelectorAll('.visited-node circle'));
    visitedCircles.forEach(circle => {
      circle.setAttributeNS(null, 'fill', '#00a8ff');
      circle.classList.remove('visited-node');
    });
  };

  animateEdge = async (tree, source, destination) => {
    console.log('animateEdge');
    const sourceIndex = tree.heap.findIndex(el => el?.id === source.id);
    const destinationIndex = tree.heap.findIndex(el => el?.id === destination.id);

    const edgeCircle = new NodeEdgeCircle({
      target: this.rootSVG,
      anchor: this.rootSVG.children[0],
      props: {
        cx: this.cxArr[sourceIndex],
        cy: this.cyArr[sourceIndex]
      }
    });

    const circle = document.getElementById('edge-circle');

    console.log('edgeCircle', edgeCircle, circle)

    // await tick();

    anime({
      targets: circle,
      translateX: `${this.cxArr[destinationIndex] - this.cxArr[sourceIndex]}%`,
      translateY: `${this.cyArr[destinationIndex] - this.cyArr[sourceIndex]}%`,
      duration: 1000,
      easing: 'easeInOutQuad'
    });

    // await wait(1000);

    this.rootSVG.removeChild(circle);

    // circle.setAttribute('style', `transform: translate(${cxArr[destinationIndex] - cxArr[sourceIndex]}%, ${cyArr[destinationIndex] - cyArr[sourceIndex]}%)`);
  };

  update = async state => {
    // debugger;
    console.log('update state', state.type);
    this.updateCxArrAndCyArr(state.tree);
    this.updateSvgHeapFromHeap(state.tree);
    await this.updateEdgeMemoFromState(state);
    await wait(state.duration);
  };

  animate = async state => {
    // debugger;
    console.log('animate state', state.type);
    // this.insertNewNodesIntoSVG(state);
    this.insertNodesIntoSVG();
    this.insertEdgesIntoSVG();
    this.animateUpdateNodeCoords(state);
    this.animateDrawEdges(state.tree);
    await wait(500);
  };

  runLatestAnimationGroup = async () => {
    console.log('runLatestAnimationGroup', this.stateGroups);
    for (const state of this.tree.stateGroups[this.tree.stateGroups.length - 1]) {
      console.log(state);
      debugger;
      await this.update(state);
      await this.animate(state);
    }
  };
}
