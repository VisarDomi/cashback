<script lang="ts">
	import { formatCurrency } from '$lib/format.ts';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data, form } = $props();

	let amount = $state('');

	function depositAnother() {
		form = null;
		amount = '';
		invalidateAll();
	}
</script>

<div class="fund-page">
	<h1>Fondo eskrou</h1>
	<p class="subtitle">Depozito fonde në llogarinë eskrou për cashback</p>

	<div class="balance-info">
		<span class="bal-label">Balancë aktuale eskrou</span>
		<span class="bal-amount">{formatCurrency(data.escrowBalance)}</span>
	</div>

	{#if form?.success}
		<div class="success-card">
			<div class="success-icon">✓</div>
			<h2>Depozita u krye!</h2>
			<p>{formatCurrency(form.amount)} u shtuan në eskrou</p>
			<button class="btn-primary" onclick={depositAnother}>Bëj një depozitë tjetër</button>
		</div>
	{:else}
		<form method="POST" use:enhance class="form">
			<div class="field">
				<label for="amount">Shuma (LEK)</label>
				<input
					id="amount"
					name="amount"
					type="number"
					bind:value={amount}
					placeholder="p.sh. 10000"
					min="1"
				/>
			</div>

			<div class="presets">
				{#each [5000, 10000, 25000, 50000] as preset}
					<button type="button" class="preset-btn" onclick={() => amount = String(preset)}>
						{preset.toLocaleString('sq-AL')}
					</button>
				{/each}
			</div>

			{#if form?.error}
				<p class="error">{form.error}</p>
			{/if}

			<button class="btn-primary" type="submit" disabled={!amount}>
				Depozito
			</button>
		</form>
	{/if}
</div>

<style>
	.fund-page {
		display: flex;
		flex-direction: column;
	}

	h1 {
		font-size: 24px;
		font-weight: 800;
		margin-bottom: 4px;
	}

	h2 {
		font-size: 20px;
		font-weight: 700;
		color: var(--green);
	}

	.subtitle {
		font-size: 14px;
		color: var(--text-dim);
		margin-bottom: 20px;
	}

	.balance-info {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 16px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
	}

	.bal-label {
		font-size: 13px;
		color: var(--text-dim);
	}

	.bal-amount {
		font-size: 18px;
		font-weight: 700;
		color: var(--accent-light);
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	label {
		font-size: 13px;
		font-weight: 600;
		color: var(--text-dim);
	}

	input {
		width: 100%;
		padding: 14px 16px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		color: var(--text);
		font-size: 16px;
		font-family: inherit;
		outline: none;
		transition: border-color 0.15s;
	}

	input:focus { border-color: var(--accent); }
	input::placeholder { color: var(--text-dim); }

	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input[type='number'] { -moz-appearance: textfield; }

	.presets {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 8px;
	}

	.preset-btn {
		padding: 10px 4px;
		background: var(--surface2);
		border: 1px solid var(--border);
		border-radius: 8px;
		color: var(--text);
		font-size: 13px;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		transition: border-color 0.15s;
	}

	.preset-btn:hover {
		border-color: var(--accent);
	}

	.error {
		color: var(--red);
		font-size: 13px;
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
	.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

	.success-card {
		background: #22c55e08;
		border: 1px solid var(--green);
		border-radius: 14px;
		padding: 24px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		text-align: center;
	}

	.success-icon {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: var(--green);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		font-weight: 700;
		animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes pop {
		0% { transform: scale(0); opacity: 0; }
		100% { transform: scale(1); opacity: 1; }
	}

	.success-card p {
		font-size: 14px;
		color: var(--text-dim);
	}

	.success-card .btn-primary {
		margin-top: 8px;
	}
</style>
