<script lang="ts">
	let { data } = $props();
</script>

<div class="scan-page">
	<div class="error-view">
		<span class="error-big">✕</span>
		<h2>{data.message}</h2>
	</div>
	<div class="actions">
		<a href="/user/scan" class="btn-primary">Provo përsëri</a>
	</div>
</div>

<style>
	.scan-page {
		display: flex;
		flex-direction: column;
		min-height: 300px;
	}

	h2 { font-size: 16px; font-weight: 700; }

	.error-view {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		text-align: center;
	}

	.error-big {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: var(--red);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		font-weight: 700;
	}

	.error-view h2 { color: var(--red); }

	.actions {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 24px;
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
