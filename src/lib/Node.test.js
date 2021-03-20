import Node from "./Node";

describe("AVL Node", () => {
  it("is constructed correctly.", () => {
    const node = new Node(7);
    expect(node).toBeDefined();
    expect(node.val).toBe(7);
    expect(node.left).toBe(null);
    expect(node.right).toBe(null);
    expect(node.height).toBe(0);
    expect(node.balance).toBe(0);
  });

  it("computes the isLeaf property correctly", () => {
    const node = new Node(7);
    expect(node.isLeaf).toBe(true);

    node.left = 1;
    expect(node.isLeaf).toBe(false);

    node.left = null;
    node.right = 1;
    expect(node.isLeaf).toBe(false);

    node.right = null;
    expect(node.isLeaf).toBe(true);
  });
});
