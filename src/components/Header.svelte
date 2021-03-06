<style>
  /* font-size: calc([minimum size] + ([maximum size] - [minimum size]) * ((100vw - [minimum viewport width]) / ([maximum viewport width] - [minimum viewport width]))); */

  header {
  	min-height: 100px;
  	height: 10%;
  	/* background: linear-gradient(to bottom, #0e3436 50%, rgb(44, 91, 217)); */
  	/* opacity: 0.5; */
  }

  .header-svg  {
    fill: white;
    margin: auto;
  }

  .svg-container {
  	margin: auto;
  	min-width: 360px;
  }

  .header-text {
    fill: #fbc531;
    transform: translateY(calc(30px + 10 * ((100vw - 300px) / 1000)));
    /* transform: translateY(30px); */
    font-size: calc(50px + 50 * ((100vw - 300px) / 1000));
  }
</style>

<script>
  import { onMount } from 'svelte';
  onMount(() => {

  })
</script>

<header>
	<div class="svg-container">
		<svg class="header-svg" width="100%" height="100px" viewBox="0 0 100 100">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo">
          <animate attributeName="values" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9; 1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9;1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -9; 1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  4 0 0 22 -11; 1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -9; 1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9; 1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" dur="8s" repeatCount="indefinite" /></feColorMatrix>
          <feComposite in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
			<text class="header-text" x="50%" y="50%" text-anchor="middle" filter="url(#goo)">pretty avl tree</text>
		</svg>
	</div>
</header>
