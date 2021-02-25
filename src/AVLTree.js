import anime from 'animejs/lib/anime.es.js';
import { tick } from 'svelte';

class Node {
	constructor(val) {
		this.val = val;
		this.left = null;
		this.right = null;
		this.balance = 0;
		this.height = 0;
	}
}

const XMLNS = 'http://www.w3.org/2000/svg';

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
		return levels;
	};

	getHeap = () => {
		const levels = this.getLevels();
		return levels.reduce((acc, level) => (
			[...acc, ...level]
		), []);
	};

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

	// insertValToLeft = (val, node) => {
	// 	if (!node.left) {
	// 		node.balance--;
	// 		node.left = this.insertValFromNode(val, node.left);
	// 		return node;
	// 	}
	// 	node.left = this.insertValFromNode(val, node.left);
	// 	node.balance = Math.abs((Math.abs((node.left || {}).balance || 0)) - (Math.abs((node.right || {}).balance) || 0));
	// 	return node;
	// };
	//
	//
	// insertValToRight = (val, node) => {
	// 	if (!node.right) {
	// 		node.balance++;
	// 		node.right = this.insertValFromNode(val, node.right);
	// 		return node
	// 	}
	// 	node.right = this.insertValFromNode(val, node.right);
	// 	node.balance = Math.abs((Math.abs((node.left || {}).balance || 0)) - (Math.abs((node.right || {}).balance) || 0));
	// 	return node;
	// };

	updateNodeHeight = node =>{
		node.height = Math.max(node.right && node.right.height !== undefined ? node.right.height : -1, node.left && node.left.height !== undefined ? node.left.height : -1) + 1;
		return node;
	};

	updateNodeBalance = node => {
		node.balance = (node.right?.height ?? -1) - (node.left?.height ?? -1);
		return node;
	};

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

	createSVGElement = (XMLNS) => {
		const svg = document.createElementNS(XMLNS, 'svg');
    svg.setAttributeNS(null, 'width', '100%');
    svg.setAttributeNS(null, 'height', '100%');
    svg.style.border = '1px solid black';
    svg.setAttribute('className', 'svg-main');
    svg.setAttributeNS(null, 'viewBox', '0 0 100 100');
		return svg;
	};

	getChildrenCoords = (cy, cyInc, levelN, index) => {
		const nextCy = cy + cyInc;
		const nextCxInc = 1 / Math.pow(2, levelN + 1) * 100;
		const leftCx = (nextCxInc / 2) + (nextCxInc * (index * 2));
		const rightCx = (nextCxInc / 2) + (nextCxInc * (index * 2 + 1));
		return { nextCy, leftCx, rightCx };
	};

	createNodeSVG = (cx, cy) => {
		const circle = document.createElementNS(XMLNS, 'circle');
		circle.setAttributeNS(null, 'cx', `${cx}%`);
		circle.setAttributeNS(null, 'cy', `${cy}%`);
		circle.setAttributeNS(null, 'r', '5');
		circle.setAttributeNS(null, 'fill', 'red');

		return circle;
	};

	createNodeLabelSVG = (cx, cy, val) => {
		const text = document.createElementNS(XMLNS, 'text');
		text.setAttributeNS(null, "x", `${cx}%`);
		text.setAttributeNS(null, "y", `${cy + 1.5}%`);
		text.setAttributeNS(null, "text-anchor", 'middle');
		text.style.fontSize = '4px';
		text.innerHTML = val;

		return text;
	};

	createNodePath = (cx, cy, nextCx, nextCy) => {
		const path = document.createElementNS(XMLNS, "path");
		path.setAttributeNS(null, "d", `M ${cx} ${cy} L ${nextCx} ${nextCy}`);
		path.setAttributeNS(null, "stroke", "black");
		path.setAttributeNS(null, "fill", "transparent");
		return path;
	};

	svg = this.createSVGElement(XMLNS);
	renderTree = () => {
		this.svg = this.createSVGElement(XMLNS);
    if (!this.root) return this.svg;

    const bfs = () => {
			/**
			 * Vertical alignment is computed by computing vertical offset as 1 / tree height, starting at (1 / height) / 2.
			 * E.g., if height is 4, rows are at height:
			 * 	(0/4 + 1/8) = 1/8
			 * 	(1/4 + 1/8) = 3/8
			 * 	(2/4 + 1/8) = 5/8
			 * 	(3/4 + 1/8) = 7/8
			 * 	This ensures equal spacing between rows plus a margin of spacing / 2 on top and bottom of tree. Tree is vertically centered in viewport.
			 */

			// vertical space between nodes at level N
			const cyInc = 1 / (this.root.height + 1) * 100;
			// vertical offset for current node.
			let cy = cyInc / 2;

			let levelN = 0;
			let level = [this.root];
			let groups = [this.svg]

			while (level.length && level.some(el => el !== null)) {
				const nextLevel = [];
				const nextGroups = [];

				// Nodes become more horizontally packed lower down in the tree.
				const cxInc = 1 / Math.pow(2, levelN) * 100;
				let cx = cxInc / 2;

				console.log("level - TOP", level)
				console.log("groups - TOP", groups)

				level.forEach((node, index) => {
					if (!node) {
						// We keep pushing null children in order to have placeholders for empty leaves.
						nextLevel.push(null, null);
						nextGroups.push(null, null);
					} else {
						const parentGroup = groups[index];
						console.log('parentGroup', parentGroup, index);

						// Calculate the coordinates of the left and right children, in order to draw the line between them.

						const { nextCy, leftCx, rightCx } = this.getChildrenCoords(cy, cyInc, levelN, index);

						console.table({ node, index, cyInc, cxInc, cy, cx, nextCy, leftCx, rightCx});

						const leftGroup = document.createElementNS(XMLNS, 'g');
						leftGroup.setAttributeNS(null, 'class', 'left');
						nextLevel.push(node.left);
						nextGroups.push(node.left ? leftGroup : null);

						if (node.left) {
							// Create path to left child.
							const leftPath = this.createNodePath(cx, cy, leftCx, nextCy);
			        parentGroup.appendChild(leftPath);
			        parentGroup.appendChild(leftGroup);
			      }

						const rightGroup = document.createElementNS(XMLNS, 'g');
						rightGroup.setAttributeNS(null, 'class', 'right');
						nextLevel.push(node.right);
						nextGroups.push(node.right ? rightGroup : null);

						if (node.right) {
							// Create path to right child.
							const rightPath = this.createNodePath(cx, cy, rightCx, nextCy);
			        parentGroup.appendChild(rightPath);
							parentGroup.appendChild(rightGroup);
			      }

						const circle = this.createNodeSVG(cx, cy);

						const text = this.createNodeLabelSVG(cx, cy, node.val);

						parentGroup.appendChild(circle);
						parentGroup.appendChild(text);

						console.log("GROUPS", groups, index)
						console.log("NEXT GROUPS", nextGroups)
					}
					cx += cxInc;
				});
				levelN++;
				level = nextLevel;
				groups = nextGroups;
				cy += cyInc;
			}
    };

    bfs(this.root);

    return this.svg;
  };

	timeline = anime.timeline({
		autoPlay: false,
	});

	nodeNotFoundAnimation = () => {
		console.log('nodeNotFoundAnimation');
		this.timeline.add({
		  targets: this.svg,
		  fill: '#fff',
		  backgroundColor: '#000',
			easing: 'easeInOutExpo',
			duration: 500
		})
		.add({
		  targets: this.svg,
		  fill: '#000',
		  backgroundColor: '#fff',
			easing: 'easeInOutExpo',
			duration: 500
		});
	};

	nodeFoundAnimation = node  => {
		console.log('nodeFoundAnimation', node);
		const circle = Array.from(node.children).filter(child => child.tagName === 'circle');
		console.log(circle);
		this.timeline.add({
		  targets: circle,
		  fill: '#000',
		  color: '#fff',
		  border: '#1f3',
			duration: 1000
		});
	};

	visitNodeAnimation = node => {
		console.log('visitNodeAnimation', node);
		const circle = Array.from(node.children).filter(child => child.tagName === 'circle');
		this.timeline.add({
		  targets: circle,
			fill: ['#ff0000', '#ccc'],
			strokeWidth: '5px',
			stroke: "#aaa",
			duration: 1000
		});
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
		this.timeline.play();
		console.log(this.timeline, this.svg);
	};
}
