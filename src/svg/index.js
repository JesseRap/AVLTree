const XMLNS = 'http://www.w3.org/2000/svg';

export const createSVGElement = () => {
  const svg = document.createElementNS(XMLNS, 'svg');
  svg.setAttributeNS(null, 'width', '80%');
  svg.setAttributeNS(null, 'height', '80%');
  svg.style.border = '1px solid black';
  svg.style.marginLeft   = '10%';
  svg.setAttribute('class', 'svg-main');
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
  svg.appendChild(defs);

  console.log('asfjkahsldjf;m', svg);

  return svg;
};
