export const getCxArr = (tree) => {
  if (!tree.root) return new Array(0);
  const levels = tree.getLevels();
  const result = levels.reduce((acc, level, index) => {
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
      ...level.map((_) => cyInc / 2 + cyInc * index),
    ],
    []
  );
  // console.log('CYARR', result);
  return result;
};
