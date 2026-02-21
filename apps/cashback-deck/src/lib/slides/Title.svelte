<script>
  import { docs } from '$lib/docs';
</script>

<div class="center">
  <div>
    <span class="tag tag-purple">Brainstorm 2026</span>
    <h1 style="font-size:56px; margin-top: 24px;">Cashback Platform<br>Albania</h1>
    <p class="subtitle" style="max-width: 600px; margin: 24px auto 0;">
      Centralizing loyalty programs across Albanian businesses.<br>
      Building the foundation for cashless payments.
    </p>
    <div class="stat-row" style="justify-content: center; margin-top: 24px;">
      <div class="stat"><div class="number">2.8M</div><div class="label">Population</div></div>
      <div class="stat"><div class="number">0</div><div class="label">Competitors</div></div>
      <div class="stat"><div class="number">85%</div><div class="label">Internet Penetration</div></div>
      <div class="stat"><div class="number">2030</div><div class="label">Cashless Goal</div></div>
    </div>
  </div>
</div>
<div id="doc-nav" class="doc-list">
  {#each Object.keys(docs) as name}
    <a href="/{name}">{name}.md</a>
  {/each}
</div>
