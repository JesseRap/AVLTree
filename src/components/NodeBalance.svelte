<style>
  @keyframes wobble {
    0% { transform: rotate(0) }
    25% { transform: rotate(5deg) }
    50% { transform: rotate(0) }
    75% { transform: rotate(-5deg) }
    100% { transform: rotate(0) }
  }

  @keyframes spin {
  	0% { transform: rotate(0deg) }
  	100% { transform: rotate(1080deg) }
  }

  .scale-group {
    transition: transform 1s;
    transform-origin: center;
  }

  polygon {
    /* transform: translate(45px, 20px); */
    transform-origin: center;
    transition: transform 1s;
    /* animation-name: spin;
    animation-duration: 3s;
    animation-direction: alternate; */
  }

  .spin {
    animation: spin 2s cubic-bezier(0.16, 1, 0.3, 1) 1s;
    transform-origin: center;
  }

  .balance {
    transition: fill 1s ease;
  }

  .balance-line-group, .balance-number-group {
    transition: all 1s ease;
  }

  .balance-line-group, .wobble-group {
    transform-origin: 50% 25%;
  }

  .wobble {
    animation: wobble 1s infinite;
  }

  .visited-node {
    box-shadow: 0 0 10px 10px yellow;
  }

  .value {
    text-shadow: -1px -1px #fbc531;
  }

  .triangle {
    transform: scale(0);
  }

  path {
    transform: translate(-25%, -30%);
  }

  text {
    font-size: 24px;
    transform: translateY(8px);
    color: #192a56;
    cursor: default;
  }
</style>

<script>
  export let color;
  export let balance;
</script>

<g class="top-container spin">
  <polygon class="triangle" points="45 30, 50 21, 55 30" fill="#7f8fa6" stroke="#000" stroke-width="0.5"/>
  <!-- <polygon points="0 10, 5 0, 10 10" fill="#7f8fa6" stroke="#000" stroke-width="0.5"/> -->
  <g class="scale-group">
    <g class={Math.abs(balance) > 0 ? 'wobble-group wobble' : 'wobble-group'}>
      <g class="balance-number-group">
        <text class="balance" x="50" y="9" text-anchor="middle" fill={color}>{balance}</text>
      </g>
      <g class="balance-line-group">
        <path d="M 50 50 H 100" stroke="black" stroke-width="3.5px" stroke-linecap="round"/>
        <path d="M 50 50 H 100" stroke="#00a8ff" stroke-width="1px" color="#00a8ff" fill="#00a8ff" stroke-linecap="round" />
      </g>
    </g>
  </g>
</g>
