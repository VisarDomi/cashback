<script lang="ts">
	import { formatCurrency, formatDate } from '$lib/format';
	import type { Transaction } from '$lib/bank-api/types';

	let { data } = $props();

	function txIsDeposit(tx: Transaction): boolean {
		return tx.type === 'escrow_deposit';
	}
</script>

<div class="dashboard">
	<div class="company-header">
		<span class="company-emoji">{data.company?.logoEmoji ?? '🏢'}</span>
		<div>
			<h1>{data.company?.name ?? 'Kompania'}</h1>
			<span class="tin">NIPT: {data.company?.tin ?? ''}</span>
		</div>
	</div>

	<div class="stats">
		<div class="stat-card accent">
			<span class="stat-label">Balancë eskrou</span>
			<span class="stat-value">{formatCurrency(data.escrowBalance)}</span>
		</div>
		<div class="stat-card">
			<span class="stat-label">Cashback i paguar</span>
			<span class="stat-value">{formatCurrency(data.totalCashbackPaid)}</span>
		</div>
		<div class="stat-card">
			<span class="stat-label">Fatura të skanuara</span>
			<span class="stat-value">{data.receiptCount}</span>
		</div>
	</div>

	{#if data.pendingCount > 0}
		<a href="/company/fund" class="pending-card">
			<span class="pending-icon">⏳</span>
			<div class="pending-info">
				<span class="pending-title">{data.pendingCount} cashback në pritje</span>
				<span class="pending-amount">{formatCurrency(data.pendingTotal)} borxh ndaj përdoruesve</span>
			</div>
			<span class="pending-cta">Fondo tani →</span>
		</a>
	{/if}

	<div class="section">
		<h2>Aktiviteti i fundit</h2>
		{#if data.recentTx.length === 0}
			<p class="empty">Asnjë transaksion</p>
		{:else}
			<div class="tx-list">
				{#each data.recentTx as tx}
					<div class="tx-row">
						<div class="tx-info">
							<span class="tx-desc">{tx.description}</span>
							<span class="tx-date">{formatDate(tx.createdAt)}</span>
						</div>
						<span class="tx-amount" style="color: {txIsDeposit(tx) ? 'var(--green)' : 'var(--red)'}">
							{txIsDeposit(tx) ? '+' : '-'}{formatCurrency(tx.amount)}
						</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.dashboard {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.company-header {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.company-emoji {
		font-size: 40px;
	}

	h1 {
		font-size: 22px;
		font-weight: 800;
	}

	.tin {
		font-size: 13px;
		color: var(--text-dim);
	}

	.stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}

	.stat-card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 14px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.stat-card.accent {
		grid-column: 1 / -1;
		background: linear-gradient(135deg, var(--accent), #4f46e5);
		border: none;
	}

	.stat-label {
		font-size: 12px;
		opacity: 0.7;
	}

	.stat-card.accent .stat-label {
		opacity: 0.85;
	}

	.stat-value {
		font-size: 22px;
		font-weight: 800;
	}

	.stat-card:not(.accent) .stat-value {
		font-size: 18px;
	}

	.pending-card {
		display: flex;
		align-items: center;
		gap: 12px;
		background: #f59e0b10;
		border: 1px solid #f59e0b;
		border-radius: 12px;
		padding: 14px;
		text-decoration: none;
		color: inherit;
		transition: background 0.15s;
	}

	.pending-card:hover { background: #f59e0b18; }

	.pending-icon { font-size: 24px; flex-shrink: 0; }

	.pending-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		min-width: 0;
	}

	.pending-title { font-size: 14px; font-weight: 600; color: #f59e0b; }
	.pending-amount { font-size: 12px; color: var(--text-dim); }
	.pending-cta { font-size: 13px; font-weight: 600; color: #f59e0b; flex-shrink: 0; }

	h2 {
		font-size: 16px;
		font-weight: 700;
		margin-bottom: 12px;
	}

	.empty {
		font-size: 14px;
		color: var(--text-dim);
		text-align: center;
		padding: 24px 0;
	}

	.tx-list {
		display: flex;
		flex-direction: column;
	}

	.tx-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 0;
		border-bottom: 1px solid var(--border);
	}

	.tx-row:last-child { border-bottom: none; }

	.tx-info {
		display: flex;
		flex-direction: column;
		min-width: 0;
		flex: 1;
		margin-right: 12px;
	}

	.tx-desc {
		font-size: 14px;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tx-date {
		font-size: 12px;
		color: var(--text-dim);
		margin-top: 2px;
	}

	.tx-amount {
		font-size: 15px;
		font-weight: 700;
		flex-shrink: 0;
	}
</style>
