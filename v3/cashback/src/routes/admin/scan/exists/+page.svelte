<script lang="ts">
	let { data } = $props();
</script>

<div class="admin-page">
	<div class="status-badge">
		<span class="status-icon">✓</span>
		<h2>Kompania ekziston</h2>
	</div>

	<div class="card">
		<div class="row">
			<span class="label">Emri</span>
			<span class="value">{data.company.logoEmoji} {data.company.name}</span>
		</div>
		<div class="row">
			<span class="label">NIPT</span>
			<span class="value mono">{data.company.tin}</span>
		</div>
		<div class="row">
			<span class="label">Cashback</span>
			<span class="value">{data.company.cashbackPercent}%</span>
		</div>
	</div>

	<div class="actions">
		<a href="/admin/scan" class="btn-primary">Skano një tjetër</a>
	</div>
</div>

<style>
	.admin-page {
		display: flex;
		flex-direction: column;
	}

	h2 { font-size: 20px; font-weight: 700; }

	.status-badge {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 16px;
	}

	.status-badge h2 { color: var(--accent-light); }

	.status-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--accent);
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
	.value.mono { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; color: var(--text-dim); }

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
