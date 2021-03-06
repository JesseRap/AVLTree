<style>
  .edge-circle {
    /* transition: transform 1s; */
    /* filter: blur(20px) contrast(30); */
    /* animation: demonstration 10s linear; */
  }
</style>

<script>
  export let cx;
  export let cy;
</script>

<filter id="edgeBlur">
  <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
  <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="contrast" />
  <feBlend in="blur" in2="contrast" />
</filter>

<circle id="edge-circle" class="edge-circle" cx={cx} cy={cy} r="3px" fill="black" filter="url(#edgeBlur)" />
