<script>
  export let value;
  export let balance;
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
@keyframes wobble {
  0% { transform: rotate(0) }
  25% { transform: rotate(5deg) }
  50% { transform: rotate(0) }
  75% { transform: rotate(-5deg) }
  100% { transform: rotate(0) }
}

svg {
  background-color: #353b48;
}

text {
  font-size: 24px;
  transform: translateY(8px);
  color: #192a56;
  cursor: default;
}

path {
  transform: translate(-25%, -30%);
}

polygon {
  transform: translate(45px, 20px);
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

</style>

<g style="transform: translate(-12.5%, -12.5%);"><svg class="node-svg" id="svg" width="25%" height="25%" viewBox="0 0 100 100">
  <defs>
    <filter id="shadow-1">
      <feDropShadow dx="1" dy="1.2" stdDeviation="0.5" flood-opacity="0.8"/>
    </filter>
  </defs>
      <polygon points="0 10, 5 0, 10 10" fill="#7f8fa6" stroke="#000" stroke-width="0.5"/>

  <g>
    <g class={Math.abs(balance) > 0 ? 'wobble-group wobble' : 'wobble-group'}>
      <g class="balance-number-group">
        <text class="balance" x="50" y="9" text-anchor="middle" fill={color}>{balance}</text>
      </g>
      <g class="balance-line-group">
        <path d="M 50 50 H 100" stroke="black" stroke-width="3.5px" stroke-linecap="round"/>
        <path d="M 50 50 H 100" stroke="#00a8ff" stroke-width="1px" color="#00a8ff" fill="#00a8ff" stroke-linecap="round" />
      </g>
    </g>
    <g style="filter: url(#shadow-1)">
      <circle id="circle" cx="50" cy="50" r="20" fill="#00a8ff" stroke="#192a56" />
      <text class="value" id="text" x="50" y="50" text-anchor="middle">{value}</text>
    </g>
  </g>
</svg></g>
