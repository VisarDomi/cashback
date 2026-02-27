<script lang="ts">
	import { enhance } from '$app/forms';

	let { children } = $props();
</script>

<div class="admin-shell">
	<header>
		<h1>Cashback — Admin</h1>
		<form method="POST" action="/logout" use:enhance>
			<button class="logout-btn" type="submit">Dil</button>
		</form>
	</header>

	<main>
		{@render children()}
	</main>
</div>

<style>
	.admin-shell {
		max-width: 420px;
		margin: 0 auto;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: calc(12px + env(safe-area-inset-top)) 20px 12px;
		border-bottom: 1px solid var(--border);
		background: var(--bg);
		position: sticky;
		top: 0;
		z-index: 10;
	}

	h1 {
		font-size: 18px;
		font-weight: 700;
		letter-spacing: -0.3px;
	}

	.logout-btn {
		background: none;
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 6px 14px;
		font-size: 13px;
		font-weight: 600;
		font-family: inherit;
		color: var(--text-dim);
		cursor: pointer;
		transition: border-color 0.15s;
	}

	.logout-btn:hover { border-color: var(--accent); }

	main {
		flex: 1;
		padding: 20px;
		padding-bottom: calc(20px + env(safe-area-inset-bottom));
	}
</style>
