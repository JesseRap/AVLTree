<style>
  .svg-main-2 {
    position: absolute;
    top: -16px;
    left: 0;
    background-color: transparent;
  }

  .svg-main-2 tspan {
    font-family: Arial, sans-serif;
    font-weight: normal;
  }

  .question-mark {
    cursor: default;
  }
</style>

<script>
  import anime from 'animejs/lib/anime.es.js';
  
  const open = () => {
    const circles = document.querySelectorAll('.clip-circle');
    circles.forEach(circle => {
      const cx = `${Math.random() * 100}%`;
      const cy = `${Math.random() * 100}%`;
      circle.setAttributeNS(null, 'cx', cx);
      circle.setAttributeNS(null, 'cy', cy);
    });
    anime({
      targets: ['.clip-circle'],
      r: '50%',
      duration: 1000,
      easing: 'easeInQuad'
    });
  };

  const close = () => {
    anime({
      targets: ['.clip-circle'],
      r: '0px',
      duration: 1000,
      easing: 'linear'
    });
  };
</script>

<svg id="svg-main-2" width="100%" height="100%" class="svg-main-2" viewBox="0 0 100 100">

  <defs>
    <clipPath id="clip">
      <!-- <polygon points="100 0, 100 200, -100 0, 100 0" fill="red" /> -->
      <!-- <polygon bind:this={clip} points="100 0, 100 0, 100 0, 100 0" fill="red" /> -->

      <circle class="clip-circle" cx="20%" cy="20%" r="0px" fill="red" />
      <circle class="clip-circle" cx="40%" cy="20%" r="0px" fill="red" />
      <circle class="clip-circle" cx="60%" cy="20%" r="0px" fill="red" />
      <circle class="clip-circle" cx="80%" cy="20%" r="0px" fill="red" />

      <circle class="clip-circle" cx="20%" cy="40%" r="0px" fill="red" />
      <circle class="clip-circle" cx="40%" cy="40%" r="0px" fill="red" />
      <circle class="clip-circle" cx="60%" cy="40%" r="0px" fill="red" />
      <circle class="clip-circle" cx="80%" cy="40%" r="0px" fill="red" />

      <circle class="clip-circle" cx="20%" cy="60%" r="0px" fill="red" />
      <circle class="clip-circle" cx="40%" cy="60%" r="0px" fill="red" />
      <circle class="clip-circle" cx="60%" cy="60%" r="0px" fill="red" />
      <circle class="clip-circle" cx="80%" cy="60%" r="0px" fill="red" />

      <circle class="clip-circle" cx="20%" cy="80%" r="0px" fill="red" />
      <circle class="clip-circle" cx="40%" cy="80%" r="0px" fill="red" />
      <circle class="clip-circle" cx="60%" cy="80%" r="0px" fill="red" />
      <circle class="clip-circle" cx="80%" cy="80%" r="0px" fill="red" />

    </clipPath>
  </defs>

  <circle on:mouseover={open} on:mouseout={close} cx="95%" cy="5%" r="3px" fill="#fbc531" />
  <text class="question-mark" on:mouseover={open} on:mouseout={close} x="93.5%" y="7%" text-anchor="center" fill="black" font-size="6px">?</text>
  <rect clip-path="url(#clip)" x="10%" y="10%" width="80%" height="80%" fill="#4cd137" />
  <text clip-path="url(#clip)" x="15%" y="10%" text-anchor="start" fill="#000">
    <tspan letter-spacing="0.4px" font-size="3px" x="15%" dy="8%">An AVL tree is a</tspan>
    <tspan letter-spacing="0.4px" font-size="3px" x="15%" dy="8%">self-balancing binary search tree (BST).</tspan>
    <tspan letter-spacing="0.4px" font-size="3px" x="15%" dy="8%">It works by keeping track of each node's</tspan>
    <tspan letter-spacing="0.4px" font-size="3px" x="15%" dy="8%">balance factor - the difference between</tspan>
    <tspan letter-spacing="0.4px" font-size="3px" x="15%" dy="8%">the heights of the left and right subtrees.</tspan>
    <tspan letter-spacing="0.4px" font-size="3px" x="15%" dy="8%">If the balance of a node exceeds 1,</tspan>
    <tspan letter-spacing="0.4px" font-size="3px" x="15%" dy="8%">the AVL property is violated.</tspan>
    <tspan letter-spacing="0.4px" font-size="3px" x="15%" dy="8%">The tree is then rebalanced by</tspan>
    <tspan letter-spacing="0.4px" font-size="3px" x="15%" dy="8%">a series of rotations.</tspan>
  </text>

</svg>
