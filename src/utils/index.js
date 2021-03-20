export const wait = async (ms) => new Promise((res) => setTimeout(res, ms));

export const nodeIdToSVGId = (node) => `g-${node?.id}`;
