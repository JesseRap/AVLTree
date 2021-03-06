<svg id="svg-main" width="80%" height="80%" class="svg-main" viewBox="0 0 100 100">
  <defs>
    <filter id="edgeBlur">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur"></feGaussianBlur>
      <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="contrast"></feColorMatrix>
      <feBlend in="blur" in2="contrast"></feBlend>
    </filter>
  </defs>
</svg>
