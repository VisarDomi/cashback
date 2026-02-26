<script lang="ts">
	import { bank } from '$lib/bank-api/mock-bank.ts';
	import { getAccountId } from '$lib/auth/auth.svelte.ts';
	import { formatCurrency, formatDate } from '$lib/format.ts';
	import type { Transaction } from '$lib/bank-api/types.ts';

	let balance = $state(0);
	let recentTx = $state<Transaction[]>([]);
	let walletId = $state('');

	function refresh() {
		const uid = getAccountId();
		if (!uid) return;
		const accounts = bank.getAccountsByOwner(uid);
		const wallet = accounts.find(a => a.type === 'user_wallet');
		if (wallet) {
			balance = wallet.balance;
			walletId = wallet.id;
			recentTx = bank.getTransactions(wallet.id).slice(0, 5);
		}
	}

	$effect(() => { refresh(); });

	function txSign(tx: Transaction): '+' | '-' {
		return tx.toAccountId === walletId ? '+' : '-';
	}

	function txColor(tx: Transaction): string {
		return tx.toAccountId === walletId ? 'var(--green)' : 'var(--red)';
	}
</script>

<div class="dashboard">
	<div class="balance-card">
		<span class="balance-label">Balanca juaj</span>
		<span class="balance-amount">{formatCurrency(balance)}</span>
		<a href="/user/transfer" class="transfer-btn">Transfero në bankë</a>
	</div>

	<div class="section">
		<div class="section-header">
			<h2>Aktiviteti i fundit</h2>
			<a href="/user/history" class="see-all">Shiko të gjitha →</a>
		</div>

		{#if recentTx.length === 0}
			<p class="empty">Asnjë transaksion ende</p>
		{:else}
			<div class="tx-list">
				{#each recentTx as tx}
					<div class="tx-row">
						<div class="tx-info">
							<span class="tx-desc">{tx.description}</span>
							<span class="tx-date">{formatDate(tx.createdAt)}</span>
						</div>
						<span class="tx-amount" style="color: {txColor(tx)}">
							{txSign(tx)}{formatCurrency(tx.amount)}
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
		gap: 24px;
	}

	.balance-card {
		background: linear-gradient(135deg, var(--accent), #4f46e5);
		border-radius: 16px;
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.balance-label {
		font-size: 13px;
		opacity: 0.8;
	}

	.balance-amount {
		font-size: 32px;
		font-weight: 800;
		letter-spacing: -0.5px;
	}

	.transfer-btn {
		display: inline-block;
		margin-top: 12px;
		padding: 10px 16px;
		background: rgba(255,255,255,0.15);
		border-radius: 10px;
		font-size: 14px;
		font-weight: 600;
		text-align: center;
		transition: background 0.15s;
	}

	.transfer-btn:hover {
		background: rgba(255,255,255,0.25);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 12px;
	}

	h2 {
		font-size: 16px;
		font-weight: 700;
	}

	.see-all {
		font-size: 13px;
		color: var(--accent-light);
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

	.tx-row:last-child {
		border-bottom: none;
	}

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
