import anime from 'animejs/lib/anime.es.js';
import AVLTree from './AVLTree.js';
import Node from '../components/Node.svelte';
import NodeEdgeCircle from '../components/NodeEdgeCircle.svelte';
import { childExistsInNode, createNodeSVG } from '../utils/svg';
import { getCxArr, getCyArr } from '../utils/tree';
import { wait } from '../utils';
import { tick } from 'svelte';

const XMLNS = 'http://www.w3.org/2000/svg';

const DURATION = 500;

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
  }

  insert = (val) => {
    // debugger;
    console.log('insert');
    this.tree.insert(val);
    this.tree = this.tree;
    this.clearAllVisitedNodes();
  };

  find = (val) => {
    console.log('find');
    this.tree.find(val);
    this.tree = this.tree;
  };

  delete = (val) => {
    console.log('delete');
    this.tree.delete(val);
    this.tree = this.tree;
  };

  reset = () => {
    console.log('reset');
    this.svgHeap = [];
    this.edgeMemo = {};
  };

  animateUpdateNodeCoords = (state) => {
    this.svgHeap.forEach((group, index) => {
      if (group) {
        console.log(
          'GROUP',
          JSON.stringify(group.style.transform),
          group.id,
          this.cxArr,
          this.cyArr
        );
        anime({
          targets: group,
          translateX: `${this.cxArr[index]}%`,
          translateY: `${this.cyArr[index]}%`,
          duration: group.style.transform === '' ? 0 : 1000,
        });

        const balance = group.querySelector('.balance');
        const heap = this.tree.heap;
        balance.innerHTML = state.tree.heap[index].balance;
        balance.setAttributeNS(
          null,
          'fill',
          Math.abs(state.tree.heap[index].balance) === 0
            ? '#7f8fa6'
            : Math.abs(state.tree.heap[index].balance) === 1
            ? '#c23616'
            : '#e84118'
        );

        const balanceLineGroup = group.querySelector('.balance-line-group');
        balanceLineGroup.setAttribute(
          'style',
          state.tree.heap[index].balance === 0
            ? 'transform: rotate(0);'
            : state.tree.heap[index].balance === 1
            ? 'transform: rotate(7deg);'
            : 'transform: rotate(-7deg)'
        );

        const balanceNumberGroup = group.querySelector('.balance-number-group');
        balanceNumberGroup.setAttribute(
          'style',
          state.tree.heap[index].balance === 0
            ? 'transform: translate(0, 0)'
            : state.tree.heap[index].balance === 1
            ? 'transform: translate(20px, 5px);'
            : 'transform: translate(-20px, 5px)'
        );

        if (this.isUnbalanced(state.tree.heap[index])) {
          balanceLineGroup.parentElement.classList.add('wobble');
        } else {
          balanceLineGroup.parentElement.classList.remove('wobble');
        }
      }
    });
  };

  isUnbalanced = (node) => Math.abs(node.balance) > 0;

  createPath = (node, tree = this.tree) => {
    console.log('createPath', node);
    debugger;
    if (!node) return;
    const i = tree.getNodeIndex(node);
    if (i === 0) return;
    if (i === -1) throw new Error('Node not found.');
    const nodeId = node.id;
    const parent = tree.getParentNode(node);
    const parentId = parent.id;
    const path = document.createElementNS(XMLNS, 'path');
    path.classList.add('edge');
    const pathId = `${nodeId}-${parentId}`;
    console.log('HERE', parent, path);
    path.setAttribute('id', pathId);
    path.setAttributeNS(null, 'filter', 'url(#edgeBlur)');
    path.setAttributeNS(
      null,
      'd',
      `M ${this.cxArr[i]} ${this.cyArr[i]} L ${
        this.cxArr[tree.parentArray[i]]
      } ${this.cyArr[tree.parentArray[i]]}`
    );
    path.setAttributeNS(null, 'stroke', 'black');
    path.setAttributeNS(null, 'fill', 'transparent');
    path.setAttributeNS(null, 'stroke-dasharray', '100');
    // path.setAttributeNS(null, 'stroke-dashoffset', '-100%');
    // anime({
    // 	targets: path,
    // 	'stroke-dashoffset': '0%',
    // 	duration: DURATION,
    // 	delay: 0,
    //   easing: 'easeOutQuad'
    // });
    return path;
  };

  animateDrawEdges = (tree) => {
    console.log('animateDrawEdges', tree);
    debugger;
    const heap = tree.heap;

    const keys = [];

    for (let i = 0; i < heap.length; i++) {
      const node = heap[i];
      if (i === 0 || !node) continue;
      const parent = tree.getParentNode(node);
      if (!parent) continue;
      const nodeId = node.id;
      const parentId = parent.id;
      const key = `${nodeId}-${parentId}`;
      keys.push(key);
      console.log('KEY', key);
      console.log('this.edgeMemo', this.edgeMemo);
      console.log('svgHeap', this.svgHeap);
      if (this.edgeMemo[key]) {
        debugger;
        console.log('update edge');
        const path = this.edgeMemo[key];
        if (!Array.from(this.rootSVG.children).find((g) => g.id === path.id)) {
          this.rootSVG.insertBefore(path, this.rootSVG.children[0]);
        }
        // if (path && !heap[i]) {
        // 	svg.removeChild(path);
        // 	delete tree.edgeMemo[i];
        // }
        path.setAttributeNS(
          null,
          'd',
          `M ${this.cxArr[i]} ${this.cyArr[i]} L ${
            this.cxArr[tree.parentArray[i]]
          } ${this.cyArr[tree.parentArray[i]]}`
        );
        // if (!heap[i] && tree.edgeMemo[i]) {
        // 	svg.removeChild(path);
        // }
      } else {
        console.log('NOOO');
        debugger;
        if (!node) continue;
        const path = this.createPath(node, tree);
        console.log('NEW PATH', path);
        const firstNode = this.rootSVG.children[0];
        this.rootSVG.insertBefore(path, firstNode);
        path.setAttributeNS(
          null,
          'd',
          `M ${this.cxArr[i]} ${this.cyArr[i]} L ${
            this.cxArr[tree.parentArray[i]]
          } ${this.cyArr[tree.parentArray[i]]}`
        );
        // path.setAttributeNS(null, 'stroke-dashoffset', '0%');
        path.setAttributeNS(null, 'stroke-dashoffset', '-100%');
        anime({
          targets: path,
          'stroke-dashoffset': '0%',
          duration: DURATION,
          delay: 200,
        });
        this.edgeMemo[key] = path;
      }
    }

    // // remove old edges
    Object.keys(this.edgeMemo).forEach((key) => {
      debugger;
      if (!keys.includes(key)) {
        console.log('DELETE EDGE');
        anime({
          targets: this.edgeMemo[key],
          opacity: 0,
          duration: DURATION,
          delay: 1000,
        });
        const path = this.edgeMemo[key];
        if (Array.from(this.rootSVG.children).includes(path)) {
          this.rootSVG.removeChild(path);
        }
        delete this.edgeMemo[key];
      }
    });
  };

  animateStart = async (value) => {
    // big intro disply
    const circle = document.getElementById('intro-group');

    const otherNode = new Node({
      target: circle,
      props: {
        value,
        balance: 0,
        id: 'intro-node',
        isFirstNode: true,
      },
    });

    const nodeGroup = document.getElementById('intro-node');

    nodeGroup.querySelector('text').innerHTML = value; // QUESTION: why is this necssary? not reactive.

    await this.hideSVGChildrentForMS(1000);

    // start-node animation
    let startNode = document.getElementById('start-node');
    // if (startNode) this.rootSVG.removeChild(startNode);
    debugger;
    // QUESTION: Need to await tick()?
    if (!startNode) {
      const newNode = new Node({
        target: this.rootSVG,
        props: {
          value,
          anchor: this.rootSVG.children[0],
          id: 'start-node',
          isFirstNode: true,
        },
      });
    }

    const introGroup = document.getElementById('intro-group');

    const n = new Node({
      target: introGroup,
      props: {
        value,
        id: 'intro-node',
        hidden: true,
      },
    });

    startNode = document.getElementById('start-node');
    const transformGroup = startNode.querySelector('.node-transform-group');
    const balanceGroup = startNode.querySelector('.balance-line-group');

    console.log('startNode!', startNode);
    console.log('balanceGroup!', balanceGroup);
    console.log('transformGroup!', transformGroup);

    transformGroup.setAttribute('style', 'opacity: 0');

    const t = anime.timeline();

    t.add({
      targets: nodeGroup,
      translateX: '13%',
      translateY: '18%',
      scale: 3,
      duration: 0,
    })
      .add({
        targets: circle,
        opacity: 1,
        duration: 1000,
        direction: 'forward',
        easing: 'easeInOutQuad',
      })
      .add({
        targets: circle,
        opacity: 0,
        duration: 1000,
        direction: 'backward',
        easing: 'easeInOutQuad',
      })
      .add({
        targets: transformGroup,
        translateX: '15%',
        translateY: '15%',
        opacity: 0,
        duration: 1,
      })
      .add({
        targets: transformGroup,
        translateX: '15%',
        translateY: '15%',
        opacity: 1,
        duration: 1,
      })
      .add(
        {
          targets: transformGroup,
          translateX: `${this.cxArr[0] ?? 50}%`,
          translateY: `${this.cyArr[0] ?? 50}%`,
          duration: 1000,
        },
        '+=1000'
      )
      .add({
        targets: transformGroup,
        translateX: `${this.cxArr[0] ?? 50}%`,
        translateY: `${this.cyArr[0] ?? 50}%`,
        opacity: 0,
      });

    await wait(2000);
  };

  balanceScaleDown = () => {
    Array.from(document.querySelectorAll('.scale-group')).forEach((node) =>
      node.setAttribute('style', 'transform: scale(0)')
    );
    Array.from(document.querySelectorAll('polygon')).forEach((node) =>
      node.setAttribute('style', 'transform: scale(0)')
    );
  };

  balanceScaleUp = () => {
    Array.from(document.querySelectorAll('.scale-group')).forEach((node) =>
      node.setAttribute('style', 'transform: scale(1)')
    );
    Array.from(document.querySelectorAll('polygon')).forEach((node) =>
      node.setAttribute('style', 'transform: scale(1)')
    );
  };

  animateInsert = (newNode, child) => {
    const key = `${newNode.id}-${child.id}`;
    this.edgeMemo[key] = this.createPath(newNode);
    console.log('EDGE MEMO', this.edgeMemo);
  };

  hideSVGChildrentForMS = async (ms) => {
    Array.from(this.rootSVG.children).forEach(async (child) => {
      if (
        child.classList.contains('edge') ||
        !child.classList.contains('intro-node')
      ) {
        const t = anime.timeline();

        t.add({
          targets: child,
          opacity: 0,
          duration: 500,
        })
          .add({
            targets: child,
            duration: ms,
          })
          .add({
            targets: child,
            opacity: 1,
            duration: 500,
          });
      }
    });
  };

  /**
   * Updates the edge memp based on the AVL tree after changes.
   */
  updateEdgeMemoFromState = async (state) => {
    debugger;
    console.log('updateEdgeMemoFromState');
    const {
      child,
      node,
      insertValue,
      newNode,
      pivot,
      rotated,
      parent,
      leftChild,
      rightChild,
      deleteValue,
      successor,
      parentOfSuccessor,
      successorChild,
      oldRoot,
      oldRootLeft,
      oldRootRight,
      nodeLeft,
      nodeRight,
    } = state;
    if (state.type === 'insert') {
      if (newNode.id !== child.id) {
        this.animateInsert(newNode, child);
      }
    } else if (state.type === 'insertStart') {
      // this.balanceScaleDown();
      await this.animateStart(state.insertValue);
    } else if (state.type === 'insertFinish') {
      // this.balanceScaleUp();
    } else if (state.type === 'visitNode') {
      const node = state.node;
      const svg = this.svgHeap.find((el) => el?.id === `g-${node.id}`);
      svg.classList.add('visited-node');
      const nodeIndex = this.svgHeap.findIndex(
        (el) => el?.id === `g-${node.id}`
      );
      const parent = state.tree.getParentNode(node);
      debugger;
      const circle = svg.querySelector('circle');
      circle.setAttributeNS(null, 'fill', 'red');
      if (parent) {
        debugger;
        await this.animateEdge(state.tree, parent, node);
      }
    } else if (state.type === 'rebalance') {
      const oldKey = `${rotated.id}-${pivot.id}`;
      const newKey = `${pivot.id}-${rotated.id}`;
      const path = this.edgeMemo[oldKey];
      if (path) {
        this.edgeMemo[newKey] = path;
        delete this.edgeMemo[oldKey];
        path.setAttribute('id', newKey);
      }

      if (parent) {
        debugger;
        const oldParentKey = `${pivot.id}-${parent.id}`;
        const newParentKey = `${rotated.id}-${parent.id}`;
        const path = this.edgeMemo[oldParentKey];
        this.edgeMemo[newParentKey] = path;
        delete this.edgeMemo[oldParentKey];
        path.setAttribute('id', newParentKey);
      }

      const pivotIndex = this.tree.getNodeIndex(pivot);
      const pivotIsLeftChild = pivotIndex % 2 === 1;
      const otherNode = pivot[pivotIsLeftChild ? 'right' : 'left'];
      if (otherNode) {
        const oldKey = `${otherNode.id}-${rotated.id}`;
        const newKey = `${otherNode.id}-${pivot.id}`;
        const path = this.edgeMemo[oldKey];
        this.edgeMemo[newKey] = path;
        delete this.edgeMemo[oldKey];
        path.setAttribute('id', newKey);
      }
    } else if (state.type === 'delete') {
    } else if (state.type === 'deleteRootLeaf') {
      this.edgeMemo = {};
    } else if (state.type === 'deleteRootLeft') {
      const key = `${leftChild.id}-${node.id}`;
      delete this.edgeMemo[key];
    } else if (state.type === 'deleteRootRight') {
      const key = `${rightChild.id}-${node.id}`;
      delete this.edgeMemo[key];
    } else if (state.type === 'deleteLeaf') {
      const key = `${node.id}-${parent.id}`;
      delete this.edgeMemo[key];
    } else if (state.type === 'deleteLeft') {
      const key = `${leftChild.id}-${node.id}`;
      delete this.edgeMemo[key];
    } else if (state.type === 'deleteRight') {
      const key = `${rightChild.id}-${node.id}`;
      delete this.edgeMemo[key];
    } else if (state.type === 'deleteRootWithSuccessor') {
      const key1 = `${oldRootLeft.id}-${oldRoot.id}`;
      const key2 = `${oldRootRight.id}-${oldRoot.id}`;
      const newKey1 = `${oldRootLeft.id}-${successor.id}`;
      const newKey2 = `${oldRootRight.id}-${successor.id}`;
      const edge1 = this.edgeMemo[key1];
      const edge2 = this.edgeMemo[key2];
      this.edgeMemo[newKey1] = edge1;
      if (!newKey2.split('-').every((el) => el === el)) {
        this.edgeMemo[newKey2] = edge2;
      }
      delete this.edgeMemo[key1];
      delete this.edgeMemo[key2];

      const key3 = `${successor.id}-${parentOfSuccessor.id}`;
      if (successorChild) {
        const key4 = `${successorChild.id}-${successor.id}`;
        const key5 = `${successorChild.id}-${parentOfSuccessor.id}`;
        const edge = this.edgeMemo[key4];
        this.edgeMemo[key5] = edge;
        delete this.edgeMemo[key4];
      }
      delete this.edgeMemo[key3];
    } else if (state.type === 'deleteWithSuccessor') {
      const key1 = `${nodeLeft.id}-${node.id}`;
      const key2 = `${nodeRight.id}-${node.id}`;
      const newKey1 = `${nodeLeft.id}-${successor.id}`;
      const newKey2 = `${nodeRight.id}-${successor.id}`;
      const edge1 = this.edgeMemo[key1];
      const edge2 = this.edgeMemo[key2];
      this.edgeMemo[newKey1] = edge1;
      if (!newKey2.split('-').every((el) => el === el)) {
        this.edgeMemo[newKey2] = edge2;
      }
      delete this.edgeMemo[key1];
      delete this.edgeMemo[key2];

      const k1 = `${node.id}-${parent.id}`;
      const k2 = `${successor.id}-${parent.id}`;
      const edge = this.edgeMemo[k1];
      this.edgeMemo[k2] = edge;
      delete this.edgeMemo[k1];

      if (parentOfSuccessor) {
        const key3 = `${successor.id}-${parentOfSuccessor.id}`;
        delete this.edgeMemo[key3];
        if (successorChild) {
          const key4 = `${successorChild.id}-${successor.id}`;
          const key5 = `${successorChild.id}-${parentOfSuccessor.id}`;
          const edge = this.edgeMemo[key4];
          this.edgeMemo[key5] = edge;
          delete this.edgeMemo[key4];
        }
      }
      const key3 = `${successor.id}-${parentOfSuccessor.id}`;
      if (successorChild) {
        const key4 = `${successorChild.id}-${successor.id}`;
        const key5 = `${successorChild.id}-${parentOfSuccessor.id}`;
        const edge = this.edgeMemo[key4];
        this.edgeMemo[key5] = edge;
        delete this.edgeMemo[key4];
      }
      delete this.edgeMemo[key3];
    }
  };

  /**
   * Updates the SVG heap based on the AVL tree after changes.
   */
  updateSvgHeapFromHeap = (tree) => {
    console.log('updateSvgHeapFromHeap');
    if (!tree.root) {
      this.svgHeap = [];
      return;
    }
    console.log('svgHeap', this.svgHeap);
    console.log('treeHeap', tree.heap);
    this.svgHeap = tree.heap.map((node) => {
      if (!node) return null;
      // debugger;
      return (
        this.svgHeap.find((el) => el?.id === `g-${node.id}`) ||
        createNodeSVG(node)
      );
    });
  };

  insertNodesIntoSVG = () => {
    for (const group of this.svgHeap) {
      if (group && !Array.from(this.rootSVG.children).includes(group)) {
        console.log('INSERT', group);
        console.log(this.rootSVG.children);
        this.rootSVG.append(group);
        console.log(this.rootSVG.children);
      }
    }
  };

  removeOldNodesFromSVG = () => {
    const svgIds = this.svgHeap.filter((g) => !!g).map((group) => group.id);
    const children = Array.from(this.rootSVG.children);
    for (const child of children) {
      if (
        child.tagName === 'g' &&
        child.id !== 'start-node' &&
        child.id !== 'intro-group'
      ) {
        if (!svgIds.includes(child.id)) {
          this.rootSVG.removeChild(child);
        }
      }
    }
  };

  insertEdgesIntoSVG = () => {
    for (const edge of Object.values(this.edgeMemo)) {
      if (edge && !Array.from(this.rootSVG.children).includes(edge)) {
        this.rootSVG.insertBefore(edge, this.rootSVG.children[0]);
        edge.setAttributeNS(null, 'stroke-dasharray', '100');
        edge.setAttributeNS(null, 'stroke-dashoffset', '-100%');
        anime({
          targets: edge,
          'stroke-dashoffset': '0%',
          duration: DURATION,
          delay: 0,
          easing: 'easeOutQuad',
        });
      }
    }
  };

  removeOldEdgesFromSVG = () => {
    const keys = Object.keys(this.edgeMemo);
    Array.from(this.rootSVG.children).forEach((group) => {
      if (
        group.id !== 'start-node' &&
        group.id !== 'node-group' &&
        group.tagName === 'path'
      ) {
        if (!keys.includes(group.id)) {
          const svg = document.getElementById(group.id);
          this.rootSVG.removeChild(svg);
        }
      }
    });
  };

  updateCxArrAndCyArr = (tree) => {
    this.cxArr = getCxArr(tree);
    this.cyArr = getCyArr(tree);
  };

  clearAllVisitedNodes = () => {
    const visitedCircles = Array.from(
      document.querySelectorAll('.visited-node circle')
    );
    visitedCircles.forEach((circle) => {
      circle.setAttributeNS(null, 'fill', '#00a8ff');
      circle.classList.remove('visited-node');
    });
  };

  animateEdge = async (tree, source, destination) => {
    debugger;
    const sourceIndex = tree.heap.findIndex((el) => el?.id === source.id);
    const destinationIndex = tree.heap.findIndex(
      (el) => el?.id === destination.id
    );
    console.log(
      'animateEdge',
      source,
      destination,
      sourceIndex,
      destinationIndex
    );

    const edgeCircle = new NodeEdgeCircle({
      target: this.rootSVG,
      anchor: this.rootSVG.children[0],
      props: {
        cx: this.cxArr[sourceIndex],
        cy: this.cyArr[sourceIndex],
      },
    });

    const circle = document.getElementById('edge-circle');

    console.log('edgeCircle', edgeCircle, circle);

    anime({
      targets: circle,
      translateX: `${this.cxArr[destinationIndex] - this.cxArr[sourceIndex]}%`,
      translateY: `${this.cyArr[destinationIndex] - this.cyArr[sourceIndex]}%`,
      duration: 1000,
      easing: 'easeInOutQuad',
    });

    await wait(1000);

    this.rootSVG.removeChild(circle);
  };

  update = async (state) => {
    // debugger;
    console.log('update state', state.type);
    this.updateCxArrAndCyArr(state.tree);
    this.updateSvgHeapFromHeap(state.tree);
    await this.updateEdgeMemoFromState(state);
    await wait(DURATION);
    // await wait(state.duration || DURATION);
  };

  animate = async (state) => {
    // debugger;
    console.log('animate state', state.type);
    this.insertNodesIntoSVG();
    this.removeOldNodesFromSVG();
    this.insertEdgesIntoSVG();
    this.removeOldEdgesFromSVG();
    this.animateUpdateNodeCoords(state);
    this.animateDrawEdges(state.tree);
    await wait(DURATION);
  };

  runLatestAnimationGroup = async () => {
    console.log('runLatestAnimationGroup', this.stateGroups);
    for (const state of this.tree.stateGroups[
      this.tree.stateGroups.length - 1
    ]) {
      console.log(state);
      debugger;
      await this.update(state);
      await this.animate(state);
    }
    console.log('STATE GROUPS', this.stateGroups);
  };
}
