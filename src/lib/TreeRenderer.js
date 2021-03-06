import anime from 'animejs/lib/anime.es.js';
import AVLTree from './AVLTree.js';
import Node from '../components/Node.svelte';
import NodeEdgeCircle from '../components/NodeEdgeCircle.svelte';
import BadNodeCircle from '../components/BadNodeCircle.svelte';
import { childExistsInNode, createNodeSVG } from '../utils/svg';
import { getCxArr, getCyArr } from '../utils/tree';
import { nodeIdToSVGId, wait } from '../utils';
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

  constructor(svg, notes) {
    this.tree = new AVLTree();
    this.rootSVG = svg;
    this.notes = notes;
  }

  get stateGroups() {
    return this.tree?.stateGroups ?? [];
  }

  insert = (val, balanced = true) => {
    // debugger;
    console.log('insert');
    this.tree.insert(val, balanced);
    this.tree = this.tree;
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

  animateUpdateNodeCoords = (state) => {
    this.svgHeap.forEach((group, index) => {
      if (group) {
        anime({
          targets: group,
          translateX: `${this.cxArr[index]}%`,
          translateY: `${this.cyArr[index]}%`,
          duration: group.style.transform === '' ? 0 : 1000,
        });

        const balance = group.querySelector('.balance');
        const heap = this.tree.heap;
        const stateBalance = state.tree.heap[index].balance;
        balance.innerHTML = stateBalance;
        balance.setAttributeNS(
          null,
          'fill',
          Math.abs(stateBalance) === 0
            ? '#7f8fa6'
            : Math.abs(stateBalance) === 1
            ? '#c23616'
            : '#e84118'
        );

        const balanceLineGroup = group.querySelector('.balance-line-group');
        balanceLineGroup.setAttribute(
          'style',
          stateBalance === 0
            ? 'transform: rotate(0);'
            : stateBalance === 1
            ? 'transform: rotate(7deg);'
            : 'transform: rotate(-7deg)'
        );

        const balanceNumberGroup = group.querySelector('.balance-number-group');
        balanceNumberGroup.setAttribute(
          'style',
          stateBalance === 0
            ? 'transform: translate(0, 0)'
            : stateBalance === 1
            ? 'transform: translate(20px, 5px);'
            : 'transform: translate(-20px, 5px)'
        );

        if (
          state.tree.heap[index].isUnbalanced ||
          state.tree.heap[index].isVeryUnbalanced
        ) {
          balanceLineGroup.parentElement.classList.add('wobble');
        } else {
          balanceLineGroup.parentElement.classList.remove('wobble');
        }
      }
    });
  };

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
    return path;
  };

  insertFirst = (el) => {
    const children = Array.from(this.rootSVG.children);
    if (children.length) {
      this.rootSVG.insertBefore(el, this.rootSVG.children[0]);
    } else {
      this.rootSVG.append(el);
    }
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
          this.insertFirst(path);
        }
        path.setAttributeNS(
          null,
          'd',
          `M ${this.cxArr[i]} ${this.cyArr[i]} L ${
            this.cxArr[tree.parentArray[i]]
          } ${this.cyArr[tree.parentArray[i]]}`
        );
      } else {
        console.log('NOOO');
        // debugger;
        if (!node) continue;
        const path = this.createPath(node, tree);
        console.log('NEW PATH', path);
        this.insertFirst(path);
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
      // debugger;
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

  animateStart = async (value, actionType) => {
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

    this.hideSVGChildrenForMS(1000);

    // start-node animation
    let startNode = document.getElementById('start-node');
    // if (startNode) this.rootSVG.removeChild(startNode);
    // debugger;
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

    // const n = new Node({
    //   target: introGroup,
    //   props: {
    //     value,
    //     id: 'intro-node',
    //     hidden: true,
    //   },
    // });

    // debugger;

    const oldText = introGroup.querySelector('.intro-text');
    if (oldText) oldText.innerHTML = actionType.toUpperCase();

    const text = document.createElementNS(XMLNS, 'text');
    text.setAttributeNS(null, 'x', '50%');
    text.setAttributeNS(null, 'y', '20%');
    text.setAttributeNS(null, 'text-anchor', 'middle');
    text.setAttributeNS(null, 'fill', '#fbc531');
    text.setAttributeNS(null, 'stroke', '#000');
    text.classList.add('intro-text');
    text.innerHTML = actionType.toUpperCase();
    this.rootSVG.append(text);

    startNode = document.getElementById('start-node');
    const transformGroup = startNode.querySelector('.node-transform-group');
    const balanceGroup = startNode.querySelector('.balance-line-group');
    const startCircle = startNode.querySelector('.node-circle__value');
    startCircle.innerHTML = value;

    const introNode = document.querySelector('#intro-node');

    console.log('startNode!', startNode);
    console.log('balanceGroup!', balanceGroup);
    console.log('transformGroup!', transformGroup);

    transformGroup.setAttribute('style', 'opacity: 0');
    text.setAttribute('style', 'opacity: 0');

    const t = anime.timeline();

    t.add({
      targets: nodeGroup,
      translateX: '13%',
      translateY: '18%',
      scale: 3,
      duration: 0,
    })
      .add({
        targets: [circle, text],
        opacity: 1,
        duration: 1000,
        direction: 'forward',
        easing: 'easeInOutQuad',
      })
      .add({
        targets: [circle, text],
        opacity: 0,
        duration: 1000,
        direction: 'backward',
        easing: 'easeInOutQuad',
      })
      .add({
        targets: transformGroup,
        translateX: '50%',
        translateY: '-15%',
        opacity: 0,
        duration: 1,
      })
      .add({
        targets: transformGroup,
        translateX: '50%',
        translateY: '-15%',
        opacity: 1,
        duration: 1,
        easing: 'easeOutQuad',
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

    introGroup.removeChild(introNode);
    this.rootSVG.removeChild(text);
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
  };

  hideSVGChildrenForMS = (ms) => {
    Array.from(this.rootSVG.children).forEach((child) => {
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

  animateVisitNode = async (state) => {
    const node = state.node;
    const svg = this.findNodeInSVGHeap(node, this.svgHeap);
    svg.classList.add('visited-node');
    const parent = state.tree.getParentNode(node);
    // debugger;
    const circle = svg.querySelector('circle');
    if (parent) {
      // debugger;
      await this.animateEdge(state.tree, parent, node);
    }
    circle.setAttributeNS(null, 'fill', '#e84118');
    await wait(1000);
    circle.setAttributeNS(null, 'fill', '#00a8ff');
  };

  animateNodeFound = async (state) => {
    const node = state.node;
    const svg = this.findNodeInSVGHeap(node, this.svgHeap);
    svg.classList.add('visited-node');
    const parent = state.tree.getParentNode(node);
    // debugger;
    const circle = svg.querySelector('circle');
    if (parent) {
      // debugger;
      await this.animateEdge(state.tree, parent, node);
    }
    circle.setAttributeNS(null, 'fill', '#fbc531');
  };

  animateRebalance = (rotated, pivot, parent) => {
    const oldKey = `${rotated.id}-${pivot.id}`;
    const newKey = `${pivot.id}-${rotated.id}`;
    const path = this.edgeMemo[oldKey];
    if (path) {
      this.edgeMemo[newKey] = path;
      delete this.edgeMemo[oldKey];
      path.setAttribute('id', newKey);
    }

    if (parent) {
      // debugger;
      const oldParentKey = `${pivot.id}-${parent.id}`;
      const newParentKey = `${rotated.id}-${parent.id}`;
      const path = this.edgeMemo[oldParentKey];
      this.edgeMemo[newParentKey] = path;
      delete this.edgeMemo[oldParentKey];
      path.setAttribute('id', newParentKey);
    }

    const pivotIsLeftChild = this.tree.isLeftChild(pivot);
    const childDirection = pivotIsLeftChild ? 'right' : 'left';
    const otherNode = pivot[childDirection];
    if (otherNode) {
      const oldKey = `${otherNode.id}-${rotated.id}`;
      const newKey = `${otherNode.id}-${pivot.id}`;
      const path = this.edgeMemo[oldKey];
      this.edgeMemo[newKey] = path;
      delete this.edgeMemo[oldKey];
      path.setAttribute('id', newKey);
    }
  };

  /**
   * Updates the edge memo based on the AVL tree after changes.
   */
  updateEdgeMemoFromState = async (state) => {
    console.log('updateEdgeMemoFromState', state.type);
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

    switch (state.type) {
      case 'insert': {
        this.notes.update((arr) => [
          ...arr,
          `Insert value ${state.insertValue}....`,
        ]);
        if (newNode.id !== child.id) {
          this.animateInsert(newNode, child);
        }
        break;
      }
      case 'insertNoRoot': {
        this.notes.update((arr) => [
          ...arr,
          'Tree is empty... Insertion point is root...',
        ]);
        this.notes.update((arr) => [
          ...arr,
          '2. Insert into insertion point...',
        ]);
        this.notes.update((arr) => [
          ...arr,
          '3. Update heights and balances...',
        ]);
        if (newNode.id !== child.id) {
          this.animateInsert(newNode, child);
        }
        break;
      }
      case 'insertStart': {
        this.notes.update((arr) => [
          ...arr,
          `Insert ${state.insertValue} into tree...`,
          '1. Find insertion point...',
        ]);
        await this.animateStart(state.insertValue, 'insert');
        break;
      }
      case 'deleteNodeFinish': {
        this.clearAllVisitedNodes();
        if (state.deleted) {
          this.notes.update((arr) => [
            ...arr,
            `Node with value ${state.deleteValue} deleted!`,
          ]);
        } else {
          this.notes.update((arr) => [...arr, `Deletion not successful!`]);
        }
        break;
      }
      case 'findNodeStart': {
        this.notes.update((arr) => [
          ...arr,
          `Find value ${state.findValue} in tree...`,
        ]);
        await this.animateStart(state.findValue, 'find');
        break;
      }
      case 'deleteNodeStart': {
        this.notes.update((arr) => [
          ...arr,
          `Delete value ${state.deleteValue} in tree...`,
          '1. Find delete value...',
        ]);
        await this.animateStart(state.deleteValue, 'delete');
        break;
      }
      case 'findNodeFinish': {
        this.clearAllVisitedNodes();
        if (state.foundNode) {
          this.notes.update((arr) => [
            ...arr,
            `Found value ${state.findValue} in tree...`,
          ]);
        } else {
          this.notes.update((arr) => [
            ...arr,
            `Value ${state.findValue} not found in tree...`,
          ]);
        }
        break;
      }
      case 'insertFinish': {
        this.notes.update((arr) => [...arr, 'Insert complete!']);
        await wait(1000);
        this.clearAllVisitedNodes();
        break;
      }
      case 'visitNode': {
        debugger;
        console.log('STATE', state);
        const value = state.findValue ?? state.insertValue ?? state.deleteValue;
        this.notes.update((arr) => {
          if (value < state.node.val) {
            return [...arr, `${value} < ${state.node.val}`, 'go left...'];
          } else {
            return [...arr, `${state.node.val} <= ${value}`, 'go right...'];
          }
        });
        await this.animateVisitNode(state);
        break;
      }
      case 'rebalance': {
        this.notes.update((arr) => [
          ...arr,
          `Rebalance node with value ${state.pivot.val}...`,
        ]);
        this.animateRebalance(rotated, pivot, parent);
        break;
      }
      case 'deleteLeaf': {
        this.notes.update((arr) => [...arr, `Delete node is a leaf...`]);
        // await wait(2000);
        await this.animateDeleteLeaf(node, parent);
        if (parent) {
          const key = `${node.id}-${parent.id}`;
          delete this.edgeMemo[key];
        } else {
          this.edgeMemo = {};
        }
        break;
      }
      case 'deleteLeft': {
        this.notes.update((arr) => [
          ...arr,
          `Delete node has a single left child...`,
        ]);
        await wait(2000);
        await this.animateDeleteLeaf(node, parent);
        // await this.animateDeleteLeft(node, parent);
        if (parent) {
          const key = `${node.id}-${parent.id}`;
          const newKey = `${leftChild.id}-${parent.id}`;
          const path = this.edgeMemo[key];
          delete this.edgeMemo[key];
          this.edgeMemo[newKey] = path;
        } else {
          const key = `${leftChild.id}-${node.id}`;
          delete this.edgeMemo[key];
        }
        break;
      }
      case 'deleteRight': {
        this.notes.update((arr) => [
          ...arr,
          `Delete node has a single right child...`,
        ]);
        await wait(2000);
        await this.animateDeleteLeaf(node, parent);
        // await this.animateDeleteLeft(node, parent);
        if (parent) {
          const key = `${node.id}-${parent.id}`;
          const newKey = `${rightChild.id}-${parent.id}`;
          const path = this.edgeMemo[key];
          delete this.edgeMemo[key];
          this.edgeMemo[newKey] = path;
        } else {
          const key = `${rightChild.id}-${node.id}`;
          delete this.edgeMemo[key];
        }
        break;
      }
      case 'deleteWithSuccessor': {
        this.notes.update((arr) => [
          ...arr,
          `Delete node has a successor...`,
          'Find the successor...',
        ]);
        this.animateDeleteWithSuccessor(state);
        break;
      }
      case 'findNodeFound': {
        this.animateNodeFound(state);
        break;
      }
      case 'findNodeNotFound': {
        this.notes.update((arr) => [
          ...arr,
          `Node ${state.findValue} not found in tree...`,
        ]);
        break;
      }
      case 'veryUnbalancedNode': {
        await this.animateVeryUnbalancedNode(state.node);
        break;
      }
      default:
        break;
    }
  };

  animateDeleteLeaf = (node, parent) => {
    const group = Array.from(this.rootSVG.children).find(
      (g) => g.id === `g-${node.id}`
    );
    console.log('HI!!!!!', group);
    anime({
      targets: group,
      translateX: 1000,
      translateY: 1000,
      duration: 5000,
    });
    if (parent) {
      const path = this.edgeMemo[`${node.id}-${parent.id}`];
      anime({
        targets: path,
        fill: 'transparent',
        duration: 5000,
      });
    }
  };

  reset = () => {
    console.log('RESET');
    this.tree.reset();
    this.tree = this.tree;
  };

  animateVeryUnbalancedNode = async (node) => {
    const svgEl = this.svgHeap.find((el) => el?.id === `g-${node.id}`);

    console.log('animateVeryUnbalancedNode', svgEl);

    const badNodeCircle = new BadNodeCircle({
      target: svgEl,
    });

    const group = document.querySelector('.bad-node-circle');

    console.log('group!', group);

    anime({
      targets: svgEl,
      scale: 1.5,
      direction: 'reverse',
      duration: 1000,
      easing: 'easeOutQuad',
    });

    await wait(1000);
    group.parentElement.removeChild(group);
  };

  animateDeleteWithSuccessor = (state) => {
    const key1 = `${state.nodeLeft.id}-${state.node.id}`;
    const key2 = `${state.nodeRight.id}-${state.node.id}`;
    const newKey1 = `${state.nodeLeft.id}-${state.successor.id}`;
    const newKey2 = `${state.nodeRight.id}-${state.successor.id}`;
    const edge1 = this.edgeMemo[key1];
    const edge2 = this.edgeMemo[key2];
    this.edgeMemo[newKey1] = edge1;
    if (!newKey2.split('-').every((el) => el === el)) {
      this.edgeMemo[newKey2] = edge2;
    }
    delete this.edgeMemo[key1];
    delete this.edgeMemo[key2];

    if (state.parent) {
      const k1 = `${state.node.id}-${state.parent.id}`;
      const k2 = `${state.successor.id}-${state.parent.id}`;
      const edge = this.edgeMemo[k1];
      this.edgeMemo[k2] = edge;
      delete this.edgeMemo[k1];
    }

    if (state.parentOfSuccessor) {
      const key3 = `${state.successor.id}-${state.parentOfSuccessor.id}`;
      delete this.edgeMemo[key3];
      if (state.successorChild) {
        const key4 = `${state.successorChild.id}-${state.successor.id}`;
        const key5 = `${state.successorChild.id}-${state.parentOfSuccessor.id}`;
        const edge = this.edgeMemo[key4];
        this.edgeMemo[key5] = edge;
        delete this.edgeMemo[key4];
      }
    }
    const key3 = `${state.successor.id}-${state.parentOfSuccessor.id}`;
    if (state.successorChild) {
      const key4 = `${state.successorChild.id}-${state.successor.id}`;
      const key5 = `${state.successorChild.id}-${state.parentOfSuccessor.id}`;
      const edge = this.edgeMemo[key4];
      this.edgeMemo[key5] = edge;
      delete this.edgeMemo[key4];
    }
    delete this.edgeMemo[key3];
  };

  /**
   * Updates the SVG heap based on the AVL tree after changes.
   * Maps nodes with ID's already in the heap and moves them if necessary, otherwise creates new node.
   */
  updateSvgHeapFromHeap = (tree) => {
    this.svgHeap = tree.heap.map((node) => {
      if (!node) return null;
      return this.findNodeInSVGHeap(node, this.svgHeap) || createNodeSVG(node);
    });
  };

  findNodeInSVGHeap = (node, heap) =>
    heap.find((el) => el?.id === nodeIdToSVGId(node));

  insertNodesIntoSVG = () => {
    for (const group of this.svgHeap) {
      if (group && !Array.from(this.rootSVG.children).includes(group)) {
        this.rootSVG.append(group);
      }
    }
  };

  removeOldNodesFromSVG = () => {
    const svgIds = this.svgHeap.filter((g) => !!g).map((group) => group.id);
    const children = Array.from(this.rootSVG.children);
    for (const child of children) {
      if (child.classList.contains('tree-node')) {
        if (!svgIds.includes(child.id)) {
          this.rootSVG.removeChild(child);
        }
      }
    }
  };

  insertEdgesIntoSVG = () => {
    for (const edge of Object.values(this.edgeMemo)) {
      if (edge && !Array.from(this.rootSVG.children).includes(edge)) {
        this.insertFirst(edge);
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
      if (group.classList.contains('edge')) {
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

    const duration = 500;

    anime({
      targets: circle,
      translateX: `${this.cxArr[destinationIndex] - this.cxArr[sourceIndex]}%`,
      translateY: `${this.cyArr[destinationIndex] - this.cyArr[sourceIndex]}%`,
      duration,
      easing: 'easeInOutQuad',
    });

    await wait(duration);

    circle.parentElement.removeChild(circle);
  };

  update = async (state) => {
    console.log('update state', state);
    this.updateCxArrAndCyArr(state.tree);
    this.updateSvgHeapFromHeap(state.tree);
    await this.updateEdgeMemoFromState(state);
    await wait(DURATION);
    // await wait(state.duration || DURATION);
  };

  animate = async (state) => {
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
      console.log('STATE:', state.type);
      await this.update(state);
      await this.animate(state);
    }
    console.log('STATE GROUPS', this.stateGroups);
  };
}
