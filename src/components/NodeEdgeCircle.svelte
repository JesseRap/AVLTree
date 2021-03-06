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

<filter id="edgeBlur2" ><feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"></feGaussianBlur><feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -28" result="contrast"></feColorMatrix><feBlend in="blur" in2="contrast"></feBlend></filter>

<circle id="edge-circle" class="edge-circle" cx={cx} cy={cy} r="3px" fill="black" filter="url(#edgeBlur2)" />
