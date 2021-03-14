const XMLNS = 'http://www.w3.org/2000/svg';

export const createSVGElement = () => {
  const svg = document.createElementNS(XMLNS, 'svg');
  svg.setAttributeNS(null, 'width', '80%');
  svg.setAttributeNS(null, 'height', '80%');
  svg.style.border = '1px solid black';
  svg.style.marginLeft   = '10%';
  svg.classList.add('svg-main');
  svg.setAttributeNS(null, 'viewBox', '0 0 100 100');

  const defs = document.createElementNS(XMLNS, 'defs');
  const filter = document.createElementNS(XMLNS, 'filter');
  filter.setAttribute('id', 'shadow');
  const feDropShadow = document.createElementNS(XMLNS, 'feDropShadow');
  feDropShadow.setAttributeNS(null, 'dx', '2');
  feDropShadow.setAttributeNS(null, 'dy', '1.4');
  feDropShadow.setAttributeNS(null, 'stdDeviation', '1.2');
  filter.appendChild(feDropShadow);
  defs.appendChild(filter);
  svg.append(defs);

  return svg;
};

export const createNodeSVG = node => {
  debugger;
  console.log('createNodeSVG');

  const g = document.createElementNS(XMLNS, 'g');
  const n = new Node({
    target: g,
    props: {
      balance: node.balance,
      value: node.val
    }
  });
  g.setAttribute('id', `g-${node.id}`); // TODO - FIXME - duplicate IDs.

  const scaleGroup = g.querySelector('.scale-group');

  // NB: Node starts with scale(0);
  scaleGroup.setAttribute('style', 'transform: scale(0);');

  return g;
};

export const childExistsInNode = (child, node) => Array.from(node.children).some(childNode =>
  childNode.id === child?.id
);
