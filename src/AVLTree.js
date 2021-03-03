import { tick } from 'svelte';

let id = 0;

export class Node {
	constructor(val) {
		this.val = val;
		this.left = null;
		this.right = null;
		this.balance = 0;
		this.height = 0;
		this.id = id++;
	}
}

export default class AVLTree {
	constructor(inputArray, copy = true) {
		this.root = null;
		this.states = [];
		if (copy) {
			this.stateGroup = [{
				type: 'initial',
				tree: this.copy()
			}];
			this.states.push(this.stateGroup);
		}
		if (inputArray) {
			for (const val of inputArray) {
				this.insert(val);
			}
		}
	}

	/**
	 * Returns a 2D-array with the nodes at each depth level of a BFS on the tree. The levels are "packed," i.e., empty nodes are filled by `null`.
	 * @return {any[][]} A 2D-array with the nodes at each depth level of a BFS on the tree.
	 */
	getLevels = () => {
		if (!this.root) return [];
		let level = [this.root];
		const levels = [];
		while (level.length && level.some(el => el !== null)) {
			levels.push(level);
			level = level.reduce((acc, node) => [...acc, node?.left || null, node?.right || null], [])
		}
		return levels;
	};

	/**
	 * Returns a heap representation of the tree.
	 * @return {any[]} Heap representation of tree with 'null' in the place of empty nodes.
	 */
	get heap() {
		const levels = this.getLevels();
		return levels.reduce((acc, level) => (
			[...acc, ...level]
		), []);
	};

	/**
	 * Update node height and balance properties after sub-tree modification.
	 * @param  {Node} node - Node to be update
	 * @return {Node} The updated node.
	 */
	updateNode = node => this.updateNodeHeight(this.updateNodeBalance(node));

	getNodeIndex = node => this.heap.indexOf(node);

	rotateLeftNode = (node) => {
		const index = this.getNodeIndex(node)
		const heap = this.heap;
		const parent = index === 0 ? null : heap[Math.floor((index - 1) / 2)];
		const isLeft = index % 2 === 1;
		const rotated = this.rotateLeft(node);
		if (parent) {
			parent[isLeft ? 'left' : 'right'] = rotated;
		} else {
			this.root = rotated;
		}
		this.updateAllNodes();
		this.stateGroup.push({
			type: 'rebalance',
			tree: this.copy(),
			pivotId: node.id,
			rotatedId: rotated.id
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
		const index = this.getNodeIndex(node)
		const heap = this.heap;
		const parent = index === 0 ? null : heap[Math.floor((index - 1) / 2)];
		const isLeft = index % 2 === 1;
		const rotated = this.rotateRight(node);
		if (parent) {
			parent[isLeft ? 'left' : 'right'] = rotated;
		} else {
			this.root = rotated;
		}
		this.updateAllNodes();
		this.stateGroup.push({
			type: 'rebalance',
			tree: this.copy(),
		});
		return rotated;
	};

	rotateLeft = node => {
		if (!node.right) {
			throw new Error('Cannot rotate left without right child.');
		}
		const temp = node.right;
		node.right = node.right?.left || null;
		temp.left = node;

		this.updateNode(node);
		this.updateNode(temp);

		// this.stateGroup.push(this);

		return temp;
	};

	rotateRight = node => {
		if (!node.left) {
			throw new Error('Cannot rotate right without left child.');
		}
		const temp = node.left;
		node.left = (node.left || {}).right || null;
		temp.right = node;

		this.updateNode(node);
		this.updateNode(temp);

		// this.stateGroup.push(this);

		return temp;
	};

	/**
	 * Update a node's height after sub-tree modifications.
	 * @param  {Node} node - The node to be updated.
	 * @return {Node}      [description]
	 */
	updateNodeHeight = node =>{
		node.height = Math.max(node.right?.height ?? -1, node.left?.height ?? -1) + 1;
		return node;
	};

	/**
	 * Update a node's balance after sub-tree modifications.
	 * @param  {Node} node - The node to be updated.
	 * @return {Node}      [description]
	 */
	updateNodeBalance = node => {
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
		for (let i = this.heap.length - 1; i >= 0; i--) {
			if (this.heap[i] && Math.abs(this.heap[i].balance) > 1) {
		 	this.rebalance(this.heap[i]);
			this.updateAllNodes();
			}
		}
	}

	/**
	 * Recursive function to insert a node with a given value starting from a certain origin node.
	 * @param  {any}  val - Value of the new node.
	 * @param  {Node}  node - The node to be inserted from.
	 * @param  {boolean} rebalance=true - Should the tree rebalance itself after insertion?
	 * @return {Node} The input `node` with the new node inserted.
	 */
	insertValFromRoot = (val, rebalance = true) => {
		this.stateGroup.push({
			type: 'insertStart',
			tree: this.copy()
		});
		console.log('INSERT', val);
		if (!this.root) {
			this.root = new Node(val);
			this.stateGroup.push({
				type: 'insert',
				tree: this.copy()
			});
			return;
		}

		let [node, previous] = [this.root, null];

		while (node) {
			const copy = this.copy();
			const n = copy.heap.find(el => el?.id === node.id);
			this.stateGroup.push({
				type: 'visitNode',
				tree: this.copy(),
				node: n
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
				previous.left = new Node(val);
			} else {
				previous.right = new Node(val);
			}
		} else {
			if (this.root.val > val) {
				this.root.left = new Node(val);
			} else {
				this.root.right = new Node(val);
			}
		}

		this.updateAllNodes();

		this.stateGroup.push({
			type: 'insert',
			tree: this.copy()
		});

		if (rebalance) {
			this.rebalanceAllNodes();
		}

		this.updateAllNodes();

		this.stateGroup.push({
			type: 'insertFinish',
			tree: this.copy(),
		});
	};

	getParentNode = (tree, node) => {
		const nodeIndex = this.getNodeIndex(tree, node);
		return nodeIndex === 0 ? null : this.heap[Math.floor(nodeIndex - 1) / 2];
	}

	switchParentEdges = (tree, child) => {
		const parent = this.getParentNode(child);
		const oldPath = `${child.id}-${parent.id}`;
		const newPath = `${parent.id}-${child.id}`;
		const path = edgesMemo[oldPath];
		edgesMemo[newPath] = path;
		delete edgesMemo[oldPath];
	};

	// TODO: Refactor for readability.
	rebalance = node => {
		console.log('rebalance', node);
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

	insert = val => {
		this.stateGroup = [];
		this.insertValFromRoot(val);
		this.states.push(this.stateGroup);
	};

	insertUnbalanced = val => {
		this.stateGroup = [];
		this.insertValFromRoot(val, false);
		this.states.push(this.stateGroup);
	};

	toString = () => {
		const levels = this.getLevels();
		return levels.map(level => level.map(el => el ? el.val : ' ').join(' ')).join('\n');
	};

	find = val => {
		const dfs = node => {
			console.log('dfs', node?.val);
			if (!node) {
				return;
			}
			if (node.val === val) {
				return node;
			}
			if (node.val >= val) {
				dfs(node.left);
			} else {
				dfs(node.right);
			}
		};

		dfs(this.root);
	};

	toHeapString = () => {
		const heap = this.heap;
		return heap.map(el => el?.val || null);
	};

	copy = () => {
		const newTree = new TreeCopier(this).copy();
		return newTree;
	};
}

class TreeCopier {
	constructor(tree) {
		this.tree = tree;
	}

	copyNodeData = (sourceNode, destNode) => {
		destNode.id = sourceNode.id;
		destNode.height = sourceNode.height;
		destNode.balance = sourceNode.balance;
	};

	copy = () => {
		const newTree = new AVLTree([], false);
		if (!this.tree.root) return newTree;
		const newRoot = new Node(this.tree.root.val);
		newTree.root = newRoot;
		this.copyNodeData(this.tree.root, newRoot);
		const dfs = (node, current) => {
			if (node.left) {
				current.left = new Node(node.left.val);
				this.copyNodeData(node.left, current.left);
				dfs(node.left, current.left);
			}
			if (node.right) {
				current.right = new Node(node.right.val);
				this.copyNodeData(node.right, current.right);
				dfs(node.right, current.right);
			}
		};
		dfs(this.tree.root, newRoot);
		return newTree
	};
}
