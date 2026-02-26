<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let overridePercent = $state<number | null>(null);
	let cashbackPercent = $derived(overridePercent ?? data.cashbackPercent);
</script>

<div class="settings">
	<h1>Konfigurim</h1>
	<p class="subtitle">Menaxho cilësimet e cashback</p>

	<div class="card">
		<h2>Përqindja e cashback</h2>
		<p class="hint">Përcakto sa % cashback marrin klientët</p>

		<form method="POST" action="?/save" use:enhance>
			<div class="slider-group">
				<input
					type="range"
					name="cashbackPercent"
					min="1"
					max="30"
					value={cashbackPercent}
					oninput={(e) => overridePercent = parseInt(e.currentTarget.value)}
				/>
				<span class="percent-display">{cashbackPercent}%</span>
			</div>

			<div class="presets">
				{#each [5, 10, 15, 20] as pct}
					<button
						type="button"
						class="preset-btn"
						class:active={cashbackPercent === pct}
						onclick={() => overridePercent = pct}
					>
						{pct}%
					</button>
				{/each}
			</div>

			<button class="btn-primary" type="submit">
				{form?.saved ? 'U ruajt!' : 'Ruaj ndryshimet'}
			</button>
		</form>
	</div>

	<div class="card danger">
		<h2>Demo</h2>
		<p class="hint">Rivendos të gjitha të dhënat e demo në gjendjen fillestare</p>
		<form method="POST" action="?/reset" use:enhance>
			<button class="btn-danger" type="submit">Rivendos demo</button>
		</form>
	</div>
</div>

<style>
	.settings {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	h1 {
		font-size: 24px;
		font-weight: 800;
		margin-bottom: 4px;
	}

	h2 {
		font-size: 16px;
		font-weight: 700;
		margin-bottom: 4px;
	}

	.subtitle {
		font-size: 14px;
		color: var(--text-dim);
		margin-bottom: 8px;
	}

	.card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 14px;
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.card.danger {
		border-color: #ef444440;
	}

	.hint {
		font-size: 13px;
		color: var(--text-dim);
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.slider-group {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	input[type='range'] {
		flex: 1;
		-webkit-appearance: none;
		appearance: none;
		height: 6px;
		background: var(--border);
		border-radius: 3px;
		outline: none;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: var(--accent);
		cursor: pointer;
	}

	input[type='range']::-moz-range-thumb {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: var(--accent);
		cursor: pointer;
		border: none;
	}

	.percent-display {
		font-size: 24px;
		font-weight: 800;
		color: var(--accent-light);
		min-width: 56px;
		text-align: right;
	}

	.presets {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 8px;
	}

	.preset-btn {
		padding: 10px;
		background: var(--surface2);
		border: 1px solid var(--border);
		border-radius: 8px;
		color: var(--text);
		font-size: 14px;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		transition: all 0.15s;
	}

	.preset-btn:hover {
		border-color: var(--accent);
	}

	.preset-btn.active {
		background: var(--accent);
		border-color: var(--accent);
		color: white;
	}

	.btn-primary {
		width: 100%;
		padding: 14px;
		background: var(--accent);
		color: white;
		border: none;
		border-radius: 12px;
		font-size: 16px;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		transition: background 0.15s;
	}

	.btn-primary:hover { background: var(--accent-light); }

	.btn-danger {
		width: 100%;
		padding: 12px;
		background: transparent;
		border: 1px solid var(--red);
		border-radius: 12px;
		color: var(--red);
		font-size: 14px;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		transition: all 0.15s;
	}

	.btn-danger:hover {
		background: var(--red);
		color: white;
	}
</style>
