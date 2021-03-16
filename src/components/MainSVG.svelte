<style>
  .svg-main {
    background-color: #2b5ada;
    filter: blur(0.5px) contrast(70);
    box-shadow: 2px 2px 11px 1px #2f3640, 3px 3px 15px 2px #000;
    margin-bottom: 32px;
  }

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

  .svg-main__container {
    position: relative;
    flex-grow: 1;
  }

  .question-mark {
    cursor: default;
  }

  #intro {
    background: radial-gradient(white 80%, transparent 100%);
  }

  #intro-group {
    opacity: 0;
  }

  @media (max-width: 1199px) {
    /* .svg-main {
      margin-left: 10%;
    } */
  }

  @media (min-width: 1200px) {
    /* .svg-main {
      margin: 32px;
    } */
  }
</style>

<script>
  import { onMount } from 'svelte';
  import anime from 'animejs/lib/anime.es.js';
  import Node from './Node.svelte';
  let clip;

  const open = () => {
    console.log('open');
    // const clip = document.querySelector('#svg-main-2 polygon');
    // anime({
    //   targets: clip,
    //   points: '100 0, 100 200, -100 0, 100 0',
    //   duration: 10000
    // });
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
    console.log('close');
    // const clip = document.querySelector('#svg-main-2 polygon');
    // anime({
    //   targets: clip,
    //   points: '100 0, 100 0, 100 0, 100 0',
    //   duration: 10000
    // });
    anime({
      targets: ['.clip-circle'],
      r: '0px',
      duration: 1000,
      easing: 'linear'
    });
  };
</script>

<div class="svg-main__container">

<svg id="svg-main" width="100%" height="100%" class="svg-main" viewBox="0 0 100 100">
  <defs>

    <radialGradient id="Gradient1" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="white"/>
      <stop offset="80%" stop-color="white" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>

    <filter id="edgeBlur">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur"></feGaussianBlur>
      <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="contrast"></feColorMatrix>
      <feBlend in="blur" in2="contrast"></feBlend>
    </filter>
  </defs>

  <g id="intro-group">
    <rect id="intro-rect" x="0" y="0" width="100%" height="100%" fill="url(#Gradient1)" />
    <Node id="intro-node" value={9} />
  </g>

</svg>

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
</div>
