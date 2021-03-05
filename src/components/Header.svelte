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
    transform: translateY(calc(30px + 10 * ((100vw - 300px) / 1000)));
    /* transform: translateY(30px); */
    font-size: calc(50px + 50 * ((100vw - 300px) / 1000));
  }
</style>

<header>
	<div class="svg-container">
		<svg class="header-svg" width="100%" height="100px" viewBox="0 0 100 100">
			<text class="header-text" x="50%" y="50%" text-anchor="middle" >pretty avl tree</text>
		</svg>
	</div>
</header>
