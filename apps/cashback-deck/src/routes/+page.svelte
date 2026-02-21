<script lang="ts">
	import { slides } from '$lib/slides';

	let current = $state(0);
	const total = slides.length;
	let Slide = $derived(slides[current]);

	function navigate(dir: number) {
		const next = current + dir;
		if (next >= 0 && next < total) {
			current = next;
		}
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); navigate(1); }
		if (e.key === 'ArrowLeft') { e.preventDefault(); navigate(-1); }
	}

	let touchStartX = 0;

	function onTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
	}

	function onTouchEnd(e: TouchEvent) {
		const diff = touchStartX - e.changedTouches[0].clientX;
		if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
	}
</script>

<svelte:window onkeydown={onKeydown} />
<svelte:body ontouchstart={onTouchStart} ontouchend={onTouchEnd} />

<div class="progress-bar" style="width: {((current + 1) / total) * 100}%"></div>

<div class="deck">
	{#key current}
		<div class="slide active">
			<Slide />
		</div>
	{/key}
</div>

<div class="nav">
	<button onclick={() => navigate(-1)} disabled={current === 0}>&larr; Previous</button>
	<span class="slide-counter">{current + 1} / {total}</span>
	<button onclick={() => navigate(1)} disabled={current === total - 1}>Next &rarr;</button>
</div>

<style>
	.deck {
		height: 100vh;
		width: 100vw;
		position: relative;
	}

	.slide {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		padding: 60px 80px;
		overflow-y: auto;
		animation: fadeIn 0.3s ease;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px 40px;
		background: linear-gradient(transparent, var(--bg) 40%);
		z-index: 100;
		pointer-events: none;
	}

	.nav button {
		pointer-events: auto;
		background: var(--surface2);
		border: 1px solid var(--border);
		color: var(--text);
		padding: 10px 24px;
		border-radius: 8px;
		cursor: pointer;
		font-family: inherit;
		font-size: 14px;
		transition: all 0.2s;
	}

	.nav button:hover { background: var(--accent); border-color: var(--accent); }
	.nav button:disabled { opacity: 0.3; cursor: default; }
	.nav button:disabled:hover { background: var(--surface2); border-color: var(--border); }

	.progress-bar {
		position: fixed;
		top: 0;
		left: 0;
		height: 3px;
		background: var(--accent);
		transition: width 0.3s ease;
		z-index: 101;
	}

	.slide-counter {
		font-size: 13px;
		color: var(--text-dim);
		font-variant-numeric: tabular-nums;
		pointer-events: auto;
	}

	@media (max-width: 900px) {
		.slide { padding: 40px 32px; }
	}
</style>
