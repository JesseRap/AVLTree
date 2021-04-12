export const getCxArr = (tree) => {
  if (!tree.root) return new Array(0);
  const levels = tree.getLevels();
  const result = levels.reduce((acc, level, index) => {
    /**
     * To center the nodes, we find the `cxInc`, which is the x-distance between
     * nodes at that level, or, 1 / the number of nodes at that level.
     */
    const cxInc = (1 / Math.pow(2, index)) * 100;
    return [...acc, ...level.map((_, idx) => cxInc / 2 + cxInc * idx)];
  }, []);
  return result;
};

export const getCyArr = (tree) => {
  if (!tree.root) return new Array(0);
  const cyInc = (1 / (tree.root.height + 1)) * 100;
  const levels = tree.getLevels();
  const result = levels.reduce(
    (acc, level, index) => [
      ...acc,
      ...level.map(() => cyInc / 2 + cyInc * index),
    ],
    []
  );
  return result;
};
