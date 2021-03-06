<style>
  text {
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
  <circle id="circle" cx="50" cy="50" r="20" fill="#00a8ff" stroke="#192a56" />
  <text class="value" id="text" x="50" y="50" text-anchor="middle">{value}</text>
</g>
