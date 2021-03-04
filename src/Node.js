// TODO: This might fail if module is imported multiple times.

let id = 0;

export default class Node {
	constructor(val) {
		this.val = val;
		this.left = null;
		this.right = null;
		this.balance = 0;
		this.height = 0;
		this.id = id++;
	}
}
