<script>
  export let value;
  export let balance;
</script>

<!-- <style>
svg {
  background-color: #353b48;
}

text {
  font-size: 24px;
  transform: translateY(8px);
  color: #192a56;
}

path {
  transform: translate(-25%, -30%);
}

polygon {
  transform: translate(45px, 20px);
}
</style> -->

<g style="transform: translate(-12.5%, -12.5%);"><svg class="node-svg" id="svg" width="25%" height="25%" viewBox="0 0 100 100">
  <defs>
    <filter id="shadow-1">
      <feDropShadow dx="1" dy="1.2" stdDeviation="0.5" flood-opacity="0.8"/>
    </filter>
  </defs>
      <polygon points="5,10 0,0 10, 0 0, Z" fill="#7f8fa6" stroke="#000" stroke-width="0.5"/>

  <g>
    <g>
      <path d="M 50 50 H 100" stroke="black" stroke-width="3.5px" stroke-linecap="round"/>
      <path d="M 50 50 H 100" stroke="#00a8ff" stroke-width="1px" color="#00a8ff" fill="#00a8ff" stroke-linecap="round" />
      <text class="balance" x="50" y="16" text-anchor="middle" fill="#fbc531">{balance}</text>
    </g>
    <g style="filter: url(#shadow-1)">
      <circle id="circle" cx="50" cy="50" r="20" fill="#00a8ff" stroke="#192a56" />
      <text class="value" id="text" x="50" y="50" text-anchor="middle">{value}</text>
    </g>
  </g>
</svg></g>
