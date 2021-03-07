<style>
  .svg-main {
    background-color: #2b5ada;
    filter: blur(0.5px) contrast(70);
    box-shadow: 2px 2px 11px 1px #2f3640, 3px 3px 15px 2px #000;
    margin-bottom: 32px;
  }

  @media (max-width: 1199px) {
    .svg-main {
      margin-left: 10%;
    }
  }

  @media (min-width: 1200px) {
    .svg-main {
      margin: 32px;
    }
  }
</style>

<svg id="svg-main" width="80%" height="80%" class="svg-main" viewBox="0 0 100 100">
  <defs>
    <filter id="edgeBlur">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur"></feGaussianBlur>
      <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="contrast"></feColorMatrix>
      <feBlend in="blur" in2="contrast"></feBlend>
    </filter>
  </defs>
</svg>
