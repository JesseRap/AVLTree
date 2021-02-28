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

	rotateLeftIndex = (index = 0) => {
		const heap = this.heap;
		const node = heap[index];
		const parent = index === 0 ? null : heap[Math.floor((index - 1) / 2)];
		const isLeft = index % 2 === 1;
		const rotated = this.rotateLeft(node);
		this.updateNode(node);
		this.updateNode(rotated);
		if (parent) {
			parent[isLeft ? 'left' : 'right'] = rotated;
		} else {
			this.root = rotated;
		}
		return rotated;
	};

	rotateRightIndex = (index = 0) => {
		const heap = this.heap;
		const node = heap[index];
		const parent = index === 0 ? this.root : heap[Math.floor((index - 1) / 2)];
		const isLeft = index % 2 === 1;
		const rotated = this.rotateRight(node);
		this.updateNode(node);
		this.updateNode(rotated);
		parent[isLeft ? 'left' : 'right'] = rotated;
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

	/**
	 * Recursive function to insert a node with a given value starting from a certain origin node.
	 * @param  {any}  val - Value of the new node.
	 * @param  {Node}  node - The node to be inserted from.
	 * @param  {boolean} rebalance=true - Should the tree rebalance itself after insertion?
	 * @return {Node} The input `node` with the new node inserted.
	 */
	insertValFromNode = (val, node, rebalance = true) => {
		if (!node) {
			return new Node(val);
		}
		if (node.val >= val) {
			console.log('go left');
			node.left = this.insertValFromNode(val, node.left, rebalance);
		} else {
			console.log('go right');
			node.right = this.insertValFromNode(val, node.right, rebalance);
		}
		this.updateNodeHeight(node);
		this.updateNodeBalance(node);
		return rebalance ? this.rebalance(node) : node;
	};

	// TODO: Refactor for readability.
	rebalance = node => {
		console.log('rebalance', node);
		if (node.balance === 2) {
			if (node.right.balance >= 0) {
				// Right-right
				return this.rotateLeft(node);
			} else {
				// Right-left
				node.right = this.rotateRight(node.right);
				return this.rotateLeft(node);
			}
		} else if (node.balance === -2) {
			if (node.left.balance <= 0) {
				// Left-left
				return this.rotateRight(node);
			} else {
				// Left-right
				node.left = this.rotateLeft(node.left);
				return this.rotateRight(node);
			}
		}
		return node;
	};

	insert = val => {
		this.root = this.insertValFromNode(val, this.root);
		this.states.push(this.heap);
	};

	insertUnbalanced = val => {
		this.root = this.insertValFromNode(val, this.root, false);
		this.states.push(this.heap);
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
