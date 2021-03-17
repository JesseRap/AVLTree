<script>
  export let cx;
  export let cy;
</script>

<filter id="edgeBlur2" ><feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"></feGaussianBlur><feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -28" result="contrast"></feColorMatrix><feBlend in="blur" in2="contrast"></feBlend></filter>

<circle id="edge-circle" class="edge-circle" cx={cx} cy={cy} r="10px" fill="black" filter="url(#edgeBlur2)" />
