<script>
  let n = 0
  export let value;
  export let hidden;
  export let balance = 0;
  export let id = n++;
  export let isFirstNode = false;
  export let isBadNode = false;

  import NodeBalance from './NodeBalance.svelte';
  // import BadNodeCircle from './BadNodeCircle.svelte';
  import NodeCircle from './NodeCircle.svelte';
  $: color = (Math.abs(balance)) === 0 ? '#7f8fa6' : (Math.abs(balance)) === 1 ? '#c23616' : '#e84118';

  const onMouseOver = () => {
    const el = document.querySelector('.node-group:hover');
    if (el) {
      const nodes = document.querySelectorAll('.node-group:not(.node-group:hover)');
      console.log(nodes);
      // nodes.forEach((node) => {
      //   node.setAttribute('style', 'opacity: 0.5;');
      // });
    }
  };

  const onMouseOut = () => {
    const nodes = document.querySelectorAll('.node-group:not(.node-group:hover)');
    console.log(nodes);
    // nodes.forEach((node) => {
    //   node.setAttribute('style', 'opacity: 1;');
    // });
  };

</script>

<style>

svg {
  background-color: #353b48;
}

.bright {
  filter: brightness(1.5);
}

.node-group {
  transform: translate(-12.5%, -12.5%);
}

.node-group:hover {
  filter: brightness(1.5);
}

.hidden {
  opacity: 0;
}
</style>

<g {id} on:mouseover={onMouseOver} on:mouseout={onMouseOut} class:hidden={hidden} class="node-group"><g class="node-transform-group"><svg class="node-svg" id="svg" width="25%" height="25%" viewBox="0 0 100 100">
  <defs>
    <filter id="shadow-1">
      <feDropShadow dx="1" dy="1.2" stdDeviation="0.5" flood-opacity="0.8"/>
    </filter>
  </defs>

  <g class="container">
    {#if !isFirstNode}
      <NodeBalance {balance} {color} {isFirstNode} />
    {/if}
    <NodeCircle {value} />
    <!-- {#if isBadNode}
      <BadNodeCircle />
    {/if} -->
  </g>
</svg></g></g>
