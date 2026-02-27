<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();
	let companyName = $state('');
</script>

<div class="admin-page">
	<div class="status-badge">
		<span class="status-icon">+</span>
		<h2>Kompani e re</h2>
	</div>

	<div class="card">
		<div class="row">
			<span class="label">NIPT</span>
			<span class="value mono">{data.tin}</span>
		</div>
		<div class="row">
			<span class="label">Cashback</span>
			<span class="value">5%</span>
		</div>
		<div class="row">
			<span class="label">Eskrou fillestar</span>
			<span class="value">50,000 LEK</span>
		</div>
	</div>

	<form method="POST" action="?/add" use:enhance class="add-form">
		<input type="hidden" name="tin" value={data.tin} />
		<div class="input-group">
			<label for="company-name">Emri i kompanisë (opsional)</label>
			<input
				id="company-name"
				type="text"
				name="name"
				bind:value={companyName}
				placeholder={data.tin}
			/>
		</div>
		<div class="actions">
			<button class="btn-primary" type="submit">Regjistro</button>
			<a href="/admin/scan" class="btn-secondary">Anulo</a>
		</div>
	</form>
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

	.status-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--accent-light);
		color: white;
		font-size: 26px;
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

	.add-form {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.input-group { margin-bottom: 20px; }

	.input-group label {
		display: block;
		font-size: 13px;
		color: var(--text-dim);
		margin-bottom: 8px;
	}

	input[type='text'] {
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

	input[type='text']:focus { border-color: var(--accent); }
	input[type='text']::placeholder { color: var(--text-dim); }

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
		transition: background 0.15s;
	}

	.btn-primary:hover { background: var(--accent-light); }

	.btn-secondary {
		width: 100%;
		padding: 14px;
		background: var(--surface);
		color: var(--text);
		border: 1px solid var(--border);
		border-radius: 12px;
		font-size: 14px;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		text-align: center;
		text-decoration: none;
		transition: border-color 0.15s;
	}

	.btn-secondary:hover { border-color: var(--accent); }
</style>
