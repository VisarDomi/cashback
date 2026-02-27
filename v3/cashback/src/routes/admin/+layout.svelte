<script lang="ts">
	import { page } from '$app/state';
	import { enhance } from '$app/forms';

	let { children } = $props();

	const tabs = [
		{ href: '/admin', label: 'Kompani', icon: '🏢' },
		{ href: '/admin/scan', label: 'Skano', icon: '📷' },
	];

	function isActive(href: string): boolean {
		if (href === '/admin') return page.url.pathname === '/admin';
		return page.url.pathname.startsWith(href);
	}
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

	<nav class="bottom-nav">
		{#each tabs as tab}
			<a href={tab.href} class="tab" class:active={isActive(tab.href)}>
				<span class="tab-icon">{tab.icon}</span>
				<span class="tab-label">{tab.label}</span>
			</a>
		{/each}
	</nav>
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
		padding-bottom: 80px;
	}

	.bottom-nav {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		max-width: 420px;
		display: flex;
		background: var(--surface);
		border-top: 1px solid var(--border);
		padding-bottom: env(safe-area-inset-bottom, 8px);
		z-index: 10;
	}

	.tab {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: 10px 0;
		color: var(--text-dim);
		transition: color 0.15s;
	}

	.tab:hover, .tab.active {
		color: var(--accent-light);
	}

	.tab-icon {
		font-size: 20px;
	}

	.tab-label {
		font-size: 11px;
		font-weight: 600;
	}
</style>
