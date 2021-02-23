<script>
  export let node;
</script>

<!-- <style>
.node {
  border: 1px solid blue;
}
</style> -->

<div class='node' style='height: 100px; width: 100px; border: 1px solid blue; border-radius: 50%;'>
  {#if node}
    val: {node?.val || ' '}
    balance: {node?.balance}
    height: {node?.height}
  {/if}
</div>
