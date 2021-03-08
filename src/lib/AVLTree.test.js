import AVLTree from './AVLTree';

describe('AVL Tree', () => {
  describe('constructor', () => {
    it('constructs empty tree correctly', () => {
      const tree = new AVLTree();
      expect(tree.root).toBeNull();
      expect(tree.heap).toEqual([]);
    });

    it('constructs a tree with input values', () => {
      let tree = new AVLTree([1]);
      expect(tree.root.val).toBe(1);
      expect(tree.root.left).toBeNull();
      expect(tree.root.right).toBeNull();
      expect(tree.heap.map(node => node.val)).toEqual([1]);

      tree = new AVLTree([1, 2, 3]);
      expect(tree.root.val).toBe(2);
      expect(tree.root.left.val).toBe(1);
      expect(tree.root.right.val).toBe(3);
      expect(tree.heap.map(node => node.val)).toEqual([2, 1, 3]);
    });
  });

  describe('getLevels', () => {
    it('correctly produces levels', () => {
      const tree = new AVLTree([1, 3, 2, 5, 4]);
      const levels = tree.getLevels().map(level => level.map(node => node?.val));
      expect(levels).toEqual([[2], [1, 4], [undefined, undefined, 3, 5]]);
    });
  });

  describe('heap', () => {
    it('correctly produces heap representations', () => {
      let tree = new AVLTree();
      expect(tree.heap).toEqual([]);

      tree = new AVLTree([1, 2]);
      let heapValues = tree.heap.map(node => node?.val);
      expect(heapValues).toEqual([1, undefined, 2]);

      tree = new AVLTree([1, 3, 2, 5, 4]);
      heapValues = tree.heap.map(node => node?.val);
      expect(heapValues).toEqual([2, 1, 4, undefined, undefined, 3, 5]);
    });
  })
})
