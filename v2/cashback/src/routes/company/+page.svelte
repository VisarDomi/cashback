<script lang="ts">
	import { bank } from '$lib/bank-api/mock-bank.ts';
	import { getAccountId } from '$lib/auth/auth.svelte.ts';
	import { formatCurrency, formatDate } from '$lib/format.ts';
	import type { Transaction, Receipt, Company } from '$lib/bank-api/types.ts';

	let escrowBalance = $state(0);
	let escrowId = $state('');
	let company = $state<Company | null>(null);
	let recentTx = $state<Transaction[]>([]);
	let receipts = $state<Receipt[]>([]);

	function refresh() {
		const cid = getAccountId();
		if (!cid) return;
		company = bank.getCompany(cid);
		const accounts = bank.getAccountsByOwner(cid);
		const escrow = accounts.find(a => a.type === 'company_escrow');
		if (escrow) {
			escrowBalance = escrow.balance;
			escrowId = escrow.id;
			recentTx = bank.getTransactions(escrow.id).slice(0, 5);
		}
		receipts = bank.getReceiptsByCompany(cid);
	}

	$effect(() => { refresh(); });

	let totalCashbackPaid = $derived(receipts.reduce((sum, r) => sum + r.cashbackAmount, 0));

	function txIsDeposit(tx: Transaction): boolean {
		return tx.type === 'escrow_deposit';
	}
</script>

<div class="dashboard">
	<div class="company-header">
		<span class="company-emoji">{company?.logoEmoji ?? '🏢'}</span>
		<div>
			<h1>{company?.name ?? 'Kompania'}</h1>
			<span class="tin">NIPT: {company?.tin ?? ''}</span>
		</div>
	</div>

	<div class="stats">
		<div class="stat-card accent">
			<span class="stat-label">Balancë eskrou</span>
			<span class="stat-value">{formatCurrency(escrowBalance)}</span>
		</div>
		<div class="stat-card">
			<span class="stat-label">Cashback i paguar</span>
			<span class="stat-value">{formatCurrency(totalCashbackPaid)}</span>
		</div>
		<div class="stat-card">
			<span class="stat-label">Fatura të skanuara</span>
			<span class="stat-value">{receipts.length}</span>
		</div>
	</div>

	<div class="section">
		<h2>Aktiviteti i fundit</h2>
		{#if recentTx.length === 0}
			<p class="empty">Asnjë transaksion</p>
		{:else}
			<div class="tx-list">
				{#each recentTx as tx}
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
