import { tick } from 'svelte';
import Node from './Node.js';
import TreeCopier from './TreeCopier.js';

export default class AVLTree {
  constructor(inputArray = [], copy = true) {
    this.root = null;
    this.stateGroups = [];
    this.stateGroup = [];
    if (copy) {
      // When we copy the tree, we set `copy` to false, otherwise there is a vicious cycle, as the tree keeps trying to copy its initial state.
      this.stateGroup = [
        {
          type: 'initial',
          tree: this.copy(),
        },
      ];
    }
    this.insertValues(inputArray);
  }

  insertValues = (valuesArr) => {
    for (const val of valuesArr) {
      this.insert(val);
    }
  };

  /**
   * Returns a 2D-array with the nodes at each depth level of a BFS on the tree. The levels are "packed," i.e., empty nodes are filled by `null`.
   * @return {any[][]} A 2D-array with the nodes at each depth level of a BFS on the tree.
   */
  getLevels = () => {
    let level = [this.root];
    const levels = [];
    while (level.length && level.some((el) => el !== null)) {
      levels.push(level);
      level = level.reduce(
        (acc, node) => [...acc, node?.left || null, node?.right || null],
        []
      );
    }
    return levels;
  };

  /**
   * Returns a heap representation of the tree.
   * @return {any[]} Heap representation of tree with 'null' in the place of empty nodes.
   */
  get heap() {
    const levels = this.getLevels();
    return levels.reduce((acc, level) => [...acc, ...level], []);
  }

  /**
   * Update node height and balance properties after sub-tree modification.
   * @param  {Node} node - Node to be update
   * @return {Node} The updated node.
   */
  updateNode = (node) => this.updateNodeHeight(this.updateNodeBalance(node));

  /**
   * Function that identifies a node in heap not by referential equality but by ID. This is because when we create copies of trees, we create new nodes with old IDs, and we may want to find the index of a referentially distinct node with the same ID.
   */
  getNodeIndex = (node) => this.heap.findIndex((n) => n?.id === node.id);

  getNodeIndexStrict = (node) => this.heap.indexOf(node);

  isBalanced = (node) => node.balance === 0;

  isUnbalanced = (node) => Math.abs(node.balance) === 1;

  isVeryUnbalanced = (node) => Math.abs(node.balance) > 1;

  setChild = (parent, childDirection, newChild) => {
    if (parent) {
      parent[childDirection] = newChild;
    } else {
      this.root = newChild;
    }
  };

  rotateLeftNode = (node) => {
    const parent = this.getParentNode(node);
    const isLeft = this.isLeftChild(node);
    const childDirection = isLeft ? 'left' : 'right';
    const rotated = this.rotateLeft(node);

    this.setChild(parent, childDirection, rotated);

    this.stateGroup.push({
      type: 'rebalance',
      tree: this.copy(),
      pivot: node,
      rotated: rotated,
      parent: parent,
    });

    return rotated;
  };

  get parentArray() {
    return this.heap.map((_, index) => {
      if (index === 0) {
        return null;
      } else {
        return Math.floor((index - 1) / 2);
      }
    });
  }

  rotateRightNode = (node) => {
    const parent = this.getParentNode(node);
    const isLeft = this.isLeftChild(node);
    const childDirection = isLeft ? 'left' : 'right';
    const rotated = this.rotateRight(node);

    this.setChild(parent, childDirection, rotated);

    this.stateGroup.push({
      type: 'rebalance',
      tree: this.copy(),
      pivot: node,
      rotated: rotated,
      parent: parent,
    });

    return rotated;
  };

  rotateLeft = (node) => {
    if (!node.right) {
      throw new Error('Cannot rotate left without right child.');
    }
    const temp = node.right;
    node.right = node.right?.left || null;
    temp.left = node;

    this.updateNode(node);
    this.updateNode(temp);

    return temp;
  };

  rotateRight = (node) => {
    if (!node.left) {
      throw new Error('Cannot rotate right without left child.');
    }
    const temp = node.left;
    node.left = (node.left || {}).right || null;
    temp.right = node;

    this.updateNode(node);
    this.updateNode(temp);

    return temp;
  };

  /**
   * Update a node's height after sub-tree modifications.
   * @param  {Node} node - The node to be updated.
   * @return {Node}      [description]
   */
  updateNodeHeight = (node) => {
    node.height =
      Math.max(node.right?.height ?? -1, node.left?.height ?? -1) + 1;
    return node;
  };

  /**
   * Update a node's balance after sub-tree modifications.
   * @param  {Node} node - The node to be updated.
   * @return {Node}      [description]
   */
  updateNodeBalance = (node) => {
    node.balance = (node.right?.height ?? -1) - (node.left?.height ?? -1);
    return node;
  };

  updateAllNodes = () => {
    const heap = this.heap;
    for (let i = heap.length - 1; i >= 0; i--) {
      if (heap[i]) {
        this.updateNode(heap[i]);
      }
    }
  };

  rebalanceAllNodes = () => {
    const heap = this.heap;
    for (let i = heap.length - 1; i >= 0; i--) {
      const node = heap[i];
      if (node && this.isVeryUnbalanced(node)) {
        this.rebalance(node);
        this.updateAllNodes();
      }
    }
  };

  /**
   * Recursive function to insert a node with a given value starting from a certain origin node.
   * @param  {any}  val - Value of the new node.
   * @param  {Node}  node - The node to be inserted from.
   * @param  {boolean} rebalance=true - Should the tree rebalance itself after insertion?
   * @return {Node} The input `node` with the new node inserted.
   */
  insertValFromRoot = (val, rebalance = true) => {
    const newNode = new Node(val);
    this.stateGroup.push({
      type: 'insertStart',
      tree: this.copy(),
      insertValue: val,
      duration: 2000,
    });
    if (!this.root) {
      this.root = newNode;
      this.stateGroup.push({
        type: 'insert',
        tree: this.copy(),
        child: this.root,
        parent: null,
        insertValue: val,
        newNode,
      });
      this.stateGroup.push({
        type: 'insertFinish',
        tree: this.copy(),
        insertValue: val,
        newNode,
      });
      this.stateGroups.push(this.stateGroup);
      return;
    }

    let [node, previous] = [this.root, null];

    while (node) {
      const copy = this.copy();
      const n = copy.heap.find((el) => el?.id === node.id);
      this.stateGroup.push({
        type: 'visitNode',
        tree: this.copy(),
        node: n,
      });
      previous = node;
      if (node.val > val) {
        node = node.left;
      } else {
        node = node.right;
      }
    }

    if (previous) {
      if (previous.val > val) {
        previous.left = newNode;
      } else {
        previous.right = newNode;
      }
    } else {
      if (this.root.val > val) {
        this.root.left = newNode;
      } else {
        this.root.right = newNode;
      }
    }

    this.updateAllNodes();

    this.stateGroup.push({
      type: 'insert',
      tree: this.copy(),
      child: previous,
      parent: this.getParentNode(previous),
      insertValue: val,
      newNode,
    });

    if (rebalance) {
      this.rebalanceAllNodes();
    }

    this.updateAllNodes();

    this.stateGroup.push({
      type: 'insertFinish',
      tree: this.copy(),
      insertValue: val,
      newNode,
    });
    this.stateGroups.push(this.stateGroup);
  };

  getParentNode = (node) => {
    const nodeIndex = this.getNodeIndex(node);
    return nodeIndex === 0 ? null : this.heap[Math.floor((nodeIndex - 1) / 2)];
  };

  // TODO: Refactor for readability.
  rebalance = (node) => {
    // console.log('rebalance', node);
    if (node.balance === 2) {
      if (node.right.balance >= 0) {
        // Right-right
        this.rotateLeftNode(node);
      } else {
        // Right-left
        this.rotateRightNode(node.right);
        this.rotateLeftNode(node);
      }
    } else if (node.balance === -2) {
      if (node.left.balance <= 0) {
        // Left-left
        this.rotateRightNode(node);
      } else {
        // Left-right
        this.rotateLeftNode(node.left);
        this.rotateRightNode(node);
      }
    }
  };

  insert = (val) => {
    this.stateGroup = [];
    this.insertValFromRoot(val);
  };

  insertUnbalanced = (val) => {
    this.stateGroup = [];
    this.insertValFromRoot(val, false);
  };

  toString = () => {
    const levels = this.getLevels();
    return levels
      .map((level) => level.map((el) => (el ? el.val : ' ')).join(' '))
      .join('\n');
  };

  find = (findValue) => {
    this.stateGroups = [];
    this.stateGroup.push({
      type: 'findStart',
      tree: this.copy(),
      findValue,
    });
    const dfs = (node) => {
      if (!node) {
        this.stateGroup.push({
          type: 'findNotFound',
          tree: this.copy(),
          findValue,
        });
        this.stateGroup.push({
          type: 'findFinish',
          tree: this.copy(),
          findValue,
        });
        this.stateGroups.push(this.stateGroup);
        return null;
      }
      if (node.val === findValue) {
        this.stateGroup.push({
          type: 'findFound',
          tree: this.copy(),
          findValue,
        });
        this.stateGroup.push({
          type: 'findFinish',
          tree: this.copy(),
          findValue,
        });
        this.stateGroups.push(this.stateGroup);
        return node;
      }
      if (node.val >= findValue) {
        this.stateGroup.push({
          type: 'visitNode',
          tree: this.copy(),
          findValue,
          node,
        });
        return dfs(node.left);
      } else {
        this.stateGroup.push({
          type: 'visitNode',
          tree: this.copy(),
          findValue,
          node,
        });
        return dfs(node.right);
      }
    };

    const foundNode = dfs(this.root);

    this.stateGroup.push({
      type: 'findFinish',
      tree: this.copy(),
      findValue,
      foundNode,
    });

    this.stateGroups.push(this.stateGroup);

    return foundNode;
  };

  isLeftChild = (node) => this.heap.indexOf(node) % 2 === 1; // root is considered left-child.

  isRightChild = (node) => this.heap.indexOf(node) % 2 === 0;

  getSuccessor = (node) => {
    if (!node.right) {
      // No right sub-tree. Successor must be parent, node must be left child.
      if (!this.isLeftChild(node)) {
        return null;
      }
      const parent = this.getParentNode(node);
      return parent;
    }

    // Successor is left-most child of right sub-tree.
    node = node.right;

    while (node.left) {
      node = node.left;
    }

    return node;
  };

  delete = (val) => {
    this.stateGroup = [];

    this.stateGroup.push({
      type: 'deleteStart',
      tree: this.copy(),
      deleteValue: val,
    });

    const node = this.find(val);
    if (node === null) {
      this.updateAllNodes();
      this.rebalanceAllNodes();
      this.stateGroup.push({
        type: 'deleteNotFound',
        tree: this.copy(),
        deleteValue: val,
      });
      this.stateGroup.push({
        type: 'deleteFinish',
        tree: this.copy(),
        deleteValue: val,
        deleted: false,
      });
      this.stateGroups.push(this.stateGroup);
      return;
    }

    const parent = this.getParentNode(node);
    const nodeIsLeftChild = this.isLeftChild(node);
    const childSide = nodeIsLeftChild ? 'left' : 'right';

    if (node.isLeaf) {
      if (parent) {
        parent[childSide] = null;
      } else {
        this.root = null;
      }
      this.stateGroup.push({
        type: 'deleteLeaf',
        tree: this.copy(),
        node,
        deleteValue: val,
        parent,
      });
    } else if (node.left && !node.right) {
      const leftChild = node.left;
      if (parent) {
        parent[childSide] = node.left;
      } else {
        // node is root
        this.root = nod.left;
      }
      this.stateGroup.push({
        type: 'deleteLeft',
        tree: this.copy(),
        node: this.root,
        leftChild,
        deleteValue: val,
        parent,
      });
    } else if (node.right && !node.left) {
      const rightChild = node.right;
      if (parent) {
        parent[childSide] = node.right;
      } else {
        // node is root
        this.root = node.right;
      }
      this.stateGroup.push({
        type: 'deleteRight',
        tree: this.copy(),
        node: this.root,
        rightChild,
        deleteValue: val,
        parent,
      });
    } else {
      const nodeLeft = node.left;
      const nodeRight = node.right;
      const successor = this.getSuccessor(node);
      const parentOfSuccessor = this.getParentNode(successor);
      const successorIsLeftChild = this.isLeftChild(successor);
      parentOfSuccessor[successorIsLeftChild ? 'left' : 'right'] =
        successor.right;
      const successorChild = successor.right;
      successor.left = node.left;
      successor.right = node.right;
      if (parent) {
        parent[nodeIsLeftChild ? 'left' : 'right'] = successor;
      } else {
        // node is root
        this.root = successor;
      }
      this.updateAllNodes();
      this.rebalanceAllNodes();

      this.stateGroup.push({
        type: 'deleteWithSuccessor',
        tree: this.copy(),
        node,
        successor,
        deleteValue: val,
        parentOfSuccessor,
        successorChild,
        parent,
        nodeLeft,
        nodeRight,
      });
    }

    this.updateAllNodes();
    this.rebalanceAllNodes();

    this.stateGroup.push({
      type: 'deleteFinish',
      tree: this.copy(),
      deleteValue: val,
      deleted: true,
    });
    this.stateGroups.push(this.stateGroup);
    return;
  };

  copy = () => {
    const newTree = new TreeCopier(this);

    return newTree.copy();
  };
}
