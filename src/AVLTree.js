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
	constructor(inputArray) {
		this.root = null;
		this.states = [];
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

	rotateRootLeft = () => {
		this.root = this.rotateLeft(this.root);
	};

	getNodeIndex = node => this.heap.indexOf(node);

	rotateLeftIndex = (node) => {
		const index = this.getNodeIndex(node)
		const heap = this.heap;
		// const node = heap[index];
		const parent = index === 0 ? null : heap[Math.floor((index - 1) / 2)];
		const isLeft = index % 2 === 1;
		const rotated = this.rotateLeft(node);
		// this.updateNode(node);
		// this.updateNode(rotated);
		if (parent) {
			parent[isLeft ? 'left' : 'right'] = rotated;
		} else {
			this.root = rotated;
		}
		this.updateAllNodes();
		return rotated;
	};

	rotateRightIndex = (node) => {
		const index = this.getNodeIndex(node)
		const heap = this.heap;
		// const node = heap[index];
		const parent = index === 0 ? null : heap[Math.floor((index - 1) / 2)];
		const isLeft = index % 2 === 1;
		const rotated = this.rotateRight(node);
		// this.updateNode(node);
		// this.updateNode(rotated);
		if (parent) {
			parent[isLeft ? 'left' : 'right'] = rotated;
		} else {
			this.root = rotated;
		}
		this.updateAllNodes();
		// parent[isLeft ? 'left' : 'right'] = rotated;
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

		// this.states.push(this);

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

		// this.states.push(this);

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
		console.log('INSERT', val);
		if (!this.root) {
			this.root = new Node(val);
			return;
		}

		let [node, previous] = [this.root, null];

		while (node) {
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

		this.states.push({
			type: 'insert',
			tree: this.toHeapString()
		});

		if (rebalance) {
			this.rebalanceAllNodes();
		}

		// if (node.val >= val) {
		// 	console.log('go left');
		// 	node.left = this.insertValFromRoot(val, node.left, rebalance);
		// } else {
		// 	console.log('go right');
		// 	node.right = this.insertValFromRoot(val, node.right, rebalance);
		// }
		// this.updateNodeHeight(node);
		// this.updateNodeBalance(node);
		// return rebalance ? this.rebalance(node) : node;
	};

	// TODO: Refactor for readability.
	rebalance = node => {
		console.log('rebalance', node);
		if (node.balance === 2) {
			if (node.right.balance >= 0) {
				// Right-right
				this.rotateLeftIndex(node);
				this.states.push({
					type: 'rebalance',
					tree: this.toHeapString()
				});
			} else {
				// Right-left
				this.rotateRightIndex(node.right);
				this.states.push({
					type: 'rebalance',
					tree: this.toHeapString()
				});
				this.rotateLeftIndex(node);
				this.states.push({
					type: 'rebalance',
					tree: this.toHeapString()
				});
			}
		} else if (node.balance === -2) {
			if (node.left.balance <= 0) {
				// Left-left
				this.rotateRightIndex(node);
				this.states.push({
					type: 'rebalance',
					tree: this.toHeapString()
				});
			} else {
				// Left-right
				this.rotateLeftIndex(node.left);
				this.states.push({
					type: 'rebalance',
					tree: this.toHeapString()
				});
				this.rotateRightIndex(node);
				this.states.push({
					type: 'rebalance',
					tree: this.toHeapString()
				});
			}
		}
	};

	insert = val => {
		this.insertValFromRoot(val);
		this.states.push({
			type: 'insert',
			tree: this.toHeapString()
		});
	};

	insertUnbalanced = val => {
		this.insertValFromRoot(val, false);
		this.states.push({
			type: 'insert',
			tree: this.toHeapString()
		});
	};

	toString = () => {
		const levels = this.getLevels();
		return levels.map(level => level.map(el => el ? el.val : ' ').join(' ')).join('\n');
	};

	find = val => {
		const dfs = (node, svgEl) => {
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
	}
}
