<script>
  import AVLTree from './AVLTree.js';
  import Node from './Node.svelte';
  const tree = new AVLTree();
  tree.insert(1);
  tree.insert(2);
  tree.insert(3);

  // tree.insert(5);
  // tree.insert(7);
  // tree.insert(1);
  // tree.insert(9);
  // tree.insert(6);

  let newValue = 0;

  const onClick = () => {
    tree.insert(newValue);
    levels = tree.getLevels();
  };

  let levels = tree.getLevels();
</script>

<div style='width: 600px; display: flex; flex-direction: column; align-items: center;'>
  {#each levels as level, index}
    <div style='display: flex; justify-content: space-around; width: 100%;'>
    {#each level as node}
      <div style={`min-width: 16px; flex-grow: 1; border: 1px solid black; text-align: center;`}>
        <div style="width: 16px; margin: auto;">
          <Node {node} />
        </div>
      </div>
    {/each}
    </div>
  {/each}
</div>

<input type='number' bind:value={newValue}>
<button on:click={onClick}>Insert</button>
