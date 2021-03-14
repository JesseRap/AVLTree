// TODO: This ID scheme might fail if module is imported multiple times.
let id = 0;

export default class Node {
	constructor(val) {
		debugger;
		this.val = val;
		this.left = null;
		this.right = null;
		this.balance = 0;
		this.height = 0;
		this.id = id++;
	}

	get isLeaf() {
		return this.left === null && this.right === null;
	}
}
