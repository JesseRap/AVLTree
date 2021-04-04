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

  let el;

  const onMouseOver = () => {
    el = document.querySelector('.node-group:hover');
    if (el) {
      el.style.filter = 'saturate(0.1)';
      const nodes = document.querySelectorAll('.node-group:not(.node-group:hover)');
      console.log(nodes);
      nodes.forEach((node) => {
        node.setAttribute('style', 'filter: blur(0.4px);');
      });
    }
  };

  const onMouseOut = () => {
    if (el) {
      el.style.filter = 'saturate(1)';
      const nodes = document.querySelectorAll('.node-group:not(.node-group:hover)');
      console.log(nodes);
      nodes.forEach((node) => {
        node.setAttribute('style', 'filter: blur(0);');
      });
    }
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
  opacity: 1;
  transform: translate(-12.5%, -12.5%);
  cursor: pointer;
}

.hidden {
  opacity: 0;
}
</style>

<g {id} on:mouseenter={onMouseOver} on:mouseleave={onMouseOut} class:hidden={hidden} class="node-group"><g class="node-transform-group"><svg class="node-svg" id="svg" width="25%" height="25%" viewBox="0 0 100 100">
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
