import AVLTree from './AVLTree';
import Node from './Node';

export default class TreeCopier {
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
