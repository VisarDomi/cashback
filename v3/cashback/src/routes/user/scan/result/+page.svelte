<script lang="ts">
	import { formatCurrency, formatDate } from '$lib/format.ts';

	let { data } = $props();
</script>

<div class="scan-page">
	<div class="verified-badge">
		<span class="check-anim">✓</span>
		<h2>Cashback i kredituar!</h2>
	</div>

	<div class="card receipt-card">
		<h3>Fatura</h3>
		<div class="row">
			<span class="label">NIPT</span>
			<span class="value">{data.receipt.tin}</span>
		</div>
		<div class="row">
			<span class="label">Shuma</span>
			<span class="value amount">{formatCurrency(data.receipt.total)}</span>
		</div>
		<div class="row">
			<span class="label">Data</span>
			<span class="value">{formatDate(data.receipt.date)}</span>
		</div>
		<div class="row">
			<span class="label">NIVF</span>
			<span class="value mono">{data.receipt.iic}</span>
		</div>
	</div>

	<div class="card cashback-card">
		<div class="cashback-icon">✓</div>
		<span class="cashback-label">Cashback i fituar</span>
		<span class="cashback-amount">+{formatCurrency(data.receipt.cashback)}</span>
		<span class="cashback-hint">Kredituar në portofolin tuaj</span>
	</div>

	<div class="actions">
		<a href="/user/scan" class="btn-primary">Skano një tjetër</a>
	</div>
</div>

<style>
	.scan-page {
		display: flex;
		flex-direction: column;
	}

	h2 { font-size: 20px; font-weight: 700; }

	h3 {
		font-size: 14px;
		font-weight: 600;
		color: var(--accent-light);
		margin-bottom: 10px;
	}

	.verified-badge {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 16px;
	}

	.verified-badge h2 { color: var(--green); }

	.check-anim {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--green);
		color: white;
		font-size: 22px;
		font-weight: 700;
		animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes pop {
		0% { transform: scale(0); opacity: 0; }
		100% { transform: scale(1); opacity: 1; }
	}

	.card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 14px;
		padding: 16px;
		margin-bottom: 12px;
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 6px 0;
		border-bottom: 1px solid var(--border);
	}

	.row:last-child { border-bottom: none; padding-bottom: 0; }
	.row:first-of-type { padding-top: 0; }

	.label { font-size: 13px; color: var(--text-dim); flex-shrink: 0; margin-right: 12px; }
	.value { font-size: 14px; font-weight: 500; text-align: right; }
	.value.amount { color: var(--accent-light); font-weight: 700; }
	.value.mono { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 11px; color: var(--text-dim); word-break: break-all; }

	.cashback-card {
		border-color: var(--green);
		background: #22c55e08;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.cashback-icon {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--green);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
		font-weight: 700;
		margin-bottom: 4px;
	}

	.cashback-label { font-size: 13px; color: var(--text-dim); }
	.cashback-amount { font-size: 24px; font-weight: 800; color: var(--green); }
	.cashback-hint { font-size: 12px; color: var(--text-dim); }

	.actions {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 12px;
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
		text-align: center;
		text-decoration: none;
		transition: background 0.15s;
	}

	.btn-primary:hover { background: var(--accent-light); }
</style>
