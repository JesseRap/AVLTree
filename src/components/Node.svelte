<script>
  export let value;
  export let balance;
  import NodeBalance from './NodeBalance.svelte';
  import NodeCircle from './NodeCircle.svelte';
  $: color = (Math.abs(balance)) === 0 ? '#7f8fa6' : (Math.abs(balance)) === 1 ? '#c23616' : '#e84118';

  // $: {
  //   switch (Math.abs(balance)) {
  //     case 0:
  //       color = '#7f8fa6';
  //       break;
  //     case 1:
  //       color = '#c23616';
  //       break;
  //     default:
  //       color = '#e84118';
  //       break;
  //   }
  // }

  // $: {
  //   console.log('COLOR', color);
  //   // console.log('ABS', abs);
  // }
</script>

<style>

svg {
  background-color: #353b48;
}

</style>

<g style="transform: translate(-12.5%, -12.5%);"><svg class="node-svg" id="svg" width="25%" height="25%" viewBox="0 0 100 100">
  <defs>
    <filter id="shadow-1">
      <feDropShadow dx="1" dy="1.2" stdDeviation="0.5" flood-opacity="0.8"/>
    </filter>
  </defs>

  <g class="container">
    <NodeBalance {balance} {color} />
    <NodeCircle {value} />
  </g>
</svg></g>
