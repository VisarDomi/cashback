<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();
</script>

<div class="companies-page">
	<h1>Kompani ({data.companies.length})</h1>

	{#if data.companies.length === 0}
		<p class="empty">Asnjë kompani e regjistruar.</p>
	{:else}
		{#each data.companies as company}
			<div class="company-row">
				<span class="company-emoji">{company.logoEmoji}</span>
				<div class="company-info">
					<span class="company-name">{company.name}</span>
					<span class="company-detail">{company.tin} — {company.cashbackPercent}%</span>
				</div>
				<form method="POST" action="?/remove" use:enhance>
					<input type="hidden" name="tin" value={company.tin} />
					<button class="remove-btn" type="submit" title="Hiq">✕</button>
				</form>
			</div>
		{/each}
	{/if}
</div>

<style>
	.companies-page {
		display: flex;
		flex-direction: column;
	}

	h1 {
		font-size: 24px;
		font-weight: 800;
		letter-spacing: -0.5px;
		margin-bottom: 16px;
	}

	.empty {
		font-size: 14px;
		color: var(--text-dim);
		text-align: center;
		padding: 40px 0;
	}

	.company-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		margin-bottom: 8px;
	}

	.company-emoji {
		font-size: 24px;
		flex-shrink: 0;
	}

	.company-info {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
	}

	.company-name {
		font-size: 14px;
		font-weight: 600;
	}

	.company-detail {
		font-size: 12px;
		color: var(--text-dim);
		margin-top: 2px;
	}

	.remove-btn {
		width: 32px;
		height: 32px;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: none;
		color: var(--text-dim);
		font-size: 14px;
		cursor: pointer;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.15s;
	}

	.remove-btn:hover {
		border-color: var(--red);
		color: var(--red);
		background: #ef444408;
	}
</style>
