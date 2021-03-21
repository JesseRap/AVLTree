<style>
  .svg-main {
    background-color: #2b5ada;
    filter: blur(0.5px) contrast(70);
    box-shadow: 2px 2px 11px 1px #2f3640, 3px 3px 15px 2px #000;
    margin-bottom: 32px;
  }

  #intro {
    background: radial-gradient(white 80%, transparent 100%);
  }

  #intro-group {
    opacity: 0;
  }
</style>

<svg id="svg-main" width="100%" height="100%" class="svg-main" viewBox="0 0 100 100">
  <defs>

    <radialGradient id="Gradient1" x1="-20%" x2="120%" y1="-20%" y2="120%">
      <stop offset="-20%" stop-color="white" stop-opacity="0.2"/>
      <stop offset="0%" stop-color="white" stop-opacity="0.5"/>
      <stop offset="80%" stop-color="white" stop-opacity="0.8" />
      <stop offset="100%" stop-color="white" />
      <stop offset="120%" stop-color="white" />
    </radialGradient>

    <filter id="edgeBlur">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur"></feGaussianBlur>
      <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="contrast"></feColorMatrix>
      <feBlend in="blur" in2="contrast"></feBlend>
    </filter>
  </defs>

  <g id="intro-group">
    <rect id="intro-rect" x="0" y="0" width="100%" height="100%" fill="#2b5ada" />
  </g>

</svg>
