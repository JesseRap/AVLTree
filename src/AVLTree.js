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
	constructor() {
		this.root = null;
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
			const nextLevel = [];
			for (const node of level) {
				if (node) {
					nextLevel.push(node.left)
					nextLevel.push(node.right)
				} else {
					nextLevel.push(null, null)
				}
			}
			level = nextLevel;
		}
		return levels;
	};

	/**
	 * Returns a heap representation of the tree.
	 * @return {any[]} Heap representation of tree with 'null' in the place of empty nodes.
	 */
	getHeap = () => {
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

	rotateLeft = node => {
		const temp = node.right;
		node.right = (node.right || {}).left || null;
		temp.left = node;

		this.updateNode(node);
		this.updateNode(temp);
		return temp;
	};

	rotateRight = node => {
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
		node.height = Math.max(node.right && node.right.height !== undefined ? node.right.height : -1, node.left && node.left.height !== undefined ? node.left.height : -1) + 1;
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
	};

	insertUnbalanced = val => {
		this.root = this.insertValFromNode(val, this.root, false);
	};

	toString = () => {
		const levels = this.getLevels();
		return levels.map(level => level.map(el => el ? el.val : ' ').join(' ')).join('\n');
	};

	find = val => {
		const dfs = (node, svgEl) => {
			console.log('dfs', node?.val);
			if (!node) {
				this.nodeNotFoundAnimation();
				return;
			}
			this.visitNodeAnimation(svgEl);
			if (node.val === val) {
				this.nodeFoundAnimation(svgEl);
				return;
			}
			if (node.val >= val) {
				const leftSVGGroup = svgEl.querySelector('.left');
				dfs(node.left, leftSVGGroup);
			} else {
				const rightSVGGroup = svgEl.querySelector('.right');
				dfs(node.right, rightSVGGroup);
			}
		};

		dfs(this.root, this.svg);
	};

	toHeapString = () => {
		const heap = this.getHeap();
		return heap.map(el => el?.val || null);
	}
}
