<script lang="ts">
	import { DEMO_ACCOUNTS } from '$lib/auth/accounts.ts';
	import { enhance } from '$app/forms';
</script>

<div class="login-page">
	<div class="hero">
		<div class="logo">💰</div>
		<h1>Cashback</h1>
		<p class="subtitle">Platforma e kthimit të parave</p>
	</div>

	<div class="accounts">
		<p class="label">Hyr si:</p>
		{#each DEMO_ACCOUNTS as account}
			<form method="POST" action="?/login" use:enhance>
				<input type="hidden" name="accountId" value={account.id} />
				<button class="account-card" type="submit">
					<span class="emoji">{account.emoji}</span>
					<div class="info">
						<span class="name">{account.name}</span>
						<span class="detail">{account.subtitle}</span>
					</div>
					<span class="arrow">→</span>
				</button>
			</form>
		{/each}
	</div>

	<p class="footer">Demo — v3</p>
</div>

<style>
	.login-page {
		max-width: 420px;
		margin: 0 auto;
		padding: calc(24px + env(safe-area-inset-top)) 20px 24px;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}

	.hero {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding-bottom: 24px;
	}

	.logo {
		font-size: 64px;
		margin-bottom: 12px;
	}

	h1 {
		font-size: 32px;
		font-weight: 800;
		letter-spacing: -0.5px;
	}

	.subtitle {
		font-size: 15px;
		color: var(--text-dim);
		margin-top: 4px;
	}

	.accounts {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.label {
		font-size: 13px;
		color: var(--text-dim);
		text-transform: uppercase;
		letter-spacing: 1px;
		font-weight: 600;
	}

	.account-card {
		display: flex;
		align-items: center;
		gap: 14px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 14px;
		padding: 16px;
		cursor: pointer;
		transition: border-color 0.15s;
		font-family: inherit;
		text-align: left;
		color: var(--text);
		width: 100%;
	}

	.account-card:hover {
		border-color: var(--accent);
	}

	.emoji {
		font-size: 32px;
		flex-shrink: 0;
	}

	.info {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
	}

	.name {
		font-size: 16px;
		font-weight: 600;
	}

	.detail {
		font-size: 13px;
		color: var(--text-dim);
		margin-top: 2px;
	}

	.arrow {
		font-size: 18px;
		color: var(--text-dim);
		flex-shrink: 0;
	}

	.footer {
		text-align: center;
		font-size: 12px;
		color: var(--text-dim);
		margin-top: 32px;
		padding-bottom: env(safe-area-inset-bottom, 16px);
	}
</style>
