import AVLTree from './AVLTree';

describe('AVL Tree', () => {
  describe('constructor', () => {
    it('constructs empty tree correctly', () => {
      const tree = new AVLTree();
      expect(tree.root).toBeNull();
      expect(tree.heap).toEqual([]);
    });
  });
})
