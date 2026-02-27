<script lang="ts">
	import { formatCurrency, formatDate } from '$lib/format';
	import type { Transaction } from '$lib/bank-api/types';

	let { data } = $props();

	let activeTab = $state<'transactions' | 'receipts'>('transactions');

	function txSign(tx: Transaction): '+' | '-' {
		return tx.toAccountId === data.walletId ? '+' : '-';
	}

	function txColor(tx: Transaction): string {
		return tx.toAccountId === data.walletId ? 'var(--green)' : 'var(--red)';
	}
</script>

<div class="history">
	<h1>Historia</h1>

	<div class="tabs">
		<button class="tab" class:active={activeTab === 'transactions'} onclick={() => activeTab = 'transactions'}>
			Transaksione
		</button>
		<button class="tab" class:active={activeTab === 'receipts'} onclick={() => activeTab = 'receipts'}>
			Fatura
		</button>
	</div>

	{#if activeTab === 'transactions'}
		{#if data.transactions.length === 0}
			<p class="empty">Asnjë transaksion</p>
		{:else}
			<div class="list">
				{#each data.transactions as tx}
					<div class="item">
						<div class="item-info">
							<span class="item-desc">{tx.description}</span>
							<span class="item-date">{formatDate(tx.createdAt)}</span>
						</div>
						<span class="item-amount" style="color: {txColor(tx)}">
							{txSign(tx)}{formatCurrency(tx.amount)}
						</span>
					</div>
				{/each}
			</div>
		{/if}
	{:else}
		{#if data.receipts.length === 0}
			<p class="empty">Asnjë faturë e skanuar</p>
		{:else}
			<div class="list">
				{#each data.receipts as r}
					<div class="item">
						<div class="item-info">
							<span class="item-desc">Faturë {formatCurrency(r.totalAmount)}</span>
							<span class="item-date">NIVF: {r.iic.slice(0, 8)}... — {formatDate(r.receiptDate)}</span>
						</div>
						<span class="item-amount" style="color: var(--green)">
							+{formatCurrency(r.cashbackAmount)}
						</span>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<style>
	.history {
		display: flex;
		flex-direction: column;
	}

	h1 {
		font-size: 24px;
		font-weight: 800;
		margin-bottom: 16px;
	}

	.tabs {
		display: flex;
		background: var(--surface);
		border-radius: 10px;
		padding: 3px;
		margin-bottom: 16px;
	}

	.tab {
		flex: 1;
		padding: 10px;
		background: none;
		border: none;
		border-radius: 8px;
		color: var(--text-dim);
		font-size: 14px;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		transition: all 0.15s;
	}

	.tab.active {
		background: var(--surface2);
		color: var(--text);
	}

	.empty {
		font-size: 14px;
		color: var(--text-dim);
		text-align: center;
		padding: 32px 0;
	}

	.list {
		display: flex;
		flex-direction: column;
	}

	.item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14px 0;
		border-bottom: 1px solid var(--border);
	}

	.item:last-child { border-bottom: none; }

	.item-info {
		display: flex;
		flex-direction: column;
		min-width: 0;
		flex: 1;
		margin-right: 12px;
	}

	.item-desc {
		font-size: 14px;
		font-weight: 500;
	}

	.item-date {
		font-size: 12px;
		color: var(--text-dim);
		margin-top: 2px;
	}

	.item-amount {
		font-size: 15px;
		font-weight: 700;
		flex-shrink: 0;
	}
</style>
