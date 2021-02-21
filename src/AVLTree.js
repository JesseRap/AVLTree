class Node {
	constructor(val) {
		this.val = val;
		this.left = null;
		this.right = null;
		this.balance = 0;
		this.height = 0;
	}
}

export default class AVLTree {
	constructor() {
		this.root = null;
	}

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
		return levels.map(level => level.map(el => el && el.val));
	};

	rotateLeft = node => {
		const temp = node.right;
		node.right = (node.right || {}).left || null;
		temp.left = node;
		return temp;
	};

// 	rotateRight = node => {
// 		const temp = node.left;
// 		temp.right = node;
// 		node.left = (node.left || {}).right || null;
// 		return temp;
// 	};

	insertValToLeft = (val, node) => {
		if (!node.left) {
			node.balance--;
			node.left = this.insertValFromNode(val, node.left);
			return node;
		}
		node.left = this.insertValFromNode(val, node.left);
		node.balance = Math.abs((Math.abs((node.left || {}).balance || 0)) - (Math.abs((node.right || {}).balance) || 0));
		return node;
	};

	// TODO: FIX BALANCE

	insertValToRight = (val, node) => {
		if (!node.right) {
			node.balance++;
			node.right = this.insertValFromNode(val, node.right);
			return node
		}
		node.right = this.insertValFromNode(val, node.right);
		node.balance = Math.abs((Math.abs((node.left || {}).balance || 0)) - (Math.abs((node.right || {}).balance) || 0));
		return node;
	};

	updateNodeHeight = node =>{
		node.height = Math.max(node.right && node.right.height !== undefined ? node.right.height : -1, node.left && node.left.height !== undefined ? node.left.height : -1) + 1;
		return node;
	};

	updateNodeBalance = node => {
		node.balance = (node.right && node.right.height || -1) - (node.left && node.left.height || -1);
		return node;
	};

	insertValFromNode = (val, node) => {
		if (!node) {
			return new Node(val);
		}
		if (node.val >= val) {
			console.log('go left');
			node.left = this.insertValFromNode(val, node.left);

		} else {
			console.log('go right');
			node.right = this.insertValFromNode(val, node.right);
		}
		this.updateNodeHeight(node);
		this.updateNodeBalance(node);
		return node;
	};

	insert = val => {
		this.root = this.insertValFromNode(val, this.root);
	};

	toString = () => {
		const levels = this.getLevels();
		return levels.map(el => el === null ? ' ' : el).join('\n');
	};
}
