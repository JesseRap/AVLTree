<style>
  .node-circle__value {
    font-size: 24px;
    transform: translateY(8px);
    color: #192a56;
    cursor: default;
  }
</style>

<script>
  export let value;
</script>

<g style="filter: url(#shadow-1)">
  <circle id="circle" class="node-circle" cx="50" cy="50" r="20" fill="#00a8ff" stroke="#192a56" />
  <text class="node-circle__value value" id="text" x="50" y="50" text-anchor="middle">{value}</text>
</g>
