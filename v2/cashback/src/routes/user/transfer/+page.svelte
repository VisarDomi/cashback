<script lang="ts">
	import { goto } from '$app/navigation';
	import { bank } from '$lib/bank-api/mock-bank.ts';
	import { getAccountId } from '$lib/auth/auth.svelte.ts';
	import { formatCurrency } from '$lib/format.ts';

	let balance = $state(0);
	let iban = $state('');
	let amount = $state('');
	let error = $state('');
	let success = $state(false);

	function refresh() {
		const uid = getAccountId();
		if (!uid) return;
		const user = bank.getUser(uid);
		if (user) iban = user.iban;
		const accounts = bank.getAccountsByOwner(uid);
		const wallet = accounts.find(a => a.type === 'user_wallet');
		if (wallet) balance = wallet.balance;
	}

	$effect(() => { refresh(); });

	function handleWithdraw() {
		error = '';
		const uid = getAccountId();
		if (!uid) return;

		const val = parseInt(amount);
		if (isNaN(val) || val <= 0) {
			error = 'Vendos një shumë të vlefshme';
			return;
		}
		if (val > balance) {
			error = 'Balancë e pamjaftueshme';
			return;
		}

		try {
			bank.withdrawToBank(uid, val, iban);
			success = true;
		} catch (e: any) {
			error = e.message;
		}
	}

	function withdrawAll() {
		amount = String(balance);
	}
</script>

<div class="transfer">
	{#if success}
		<div class="success-view">
			<div class="success-icon">✓</div>
			<h2>Transferta u krye!</h2>
			<p class="success-detail">{formatCurrency(parseInt(amount))} u transferuan në {iban}</p>
			<button class="btn-primary" onclick={() => goto('/user')}>Kthehu në ballancë</button>
		</div>
	{:else}
		<h1>Transfero në bankë</h1>
		<p class="subtitle">Tërhiq balancën në llogarinë tënde bankare</p>

		<div class="balance-info">
			<span class="bal-label">Balancë e disponueshme</span>
			<span class="bal-amount">{formatCurrency(balance)}</span>
		</div>

		<div class="form">
			<div class="field">
				<label for="iban">IBAN</label>
				<input id="iban" type="text" value={iban} disabled />
			</div>

			<div class="field">
				<label for="amount">Shuma (LEK)</label>
				<div class="amount-row">
					<input
						id="amount"
						type="number"
						bind:value={amount}
						placeholder="0"
						min="1"
						max={balance}
					/>
					<button class="max-btn" onclick={withdrawAll}>MAX</button>
				</div>
			</div>

			{#if error}
				<p class="error">{error}</p>
			{/if}

			<button class="btn-primary" onclick={handleWithdraw} disabled={!amount || balance === 0}>
				Transfero
			</button>
		</div>
	{/if}
</div>

<style>
	.transfer {
		display: flex;
		flex-direction: column;
		min-height: calc(100dvh - 140px);
	}

	h1 {
		font-size: 24px;
		font-weight: 800;
		margin-bottom: 4px;
	}

	h2 {
		font-size: 22px;
		font-weight: 700;
	}

	.subtitle {
		font-size: 14px;
		color: var(--text-dim);
		margin-bottom: 20px;
	}

	.balance-info {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 16px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
	}

	.bal-label {
		font-size: 13px;
		color: var(--text-dim);
	}

	.bal-amount {
		font-size: 18px;
		font-weight: 700;
		color: var(--accent-light);
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	label {
		font-size: 13px;
		font-weight: 600;
		color: var(--text-dim);
	}

	input {
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

	input:focus { border-color: var(--accent); }
	input:disabled { opacity: 0.5; cursor: not-allowed; }
	input::placeholder { color: var(--text-dim); }

	/* Hide number input spinners */
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input[type='number'] { -moz-appearance: textfield; }

	.amount-row {
		display: flex;
		gap: 8px;
	}

	.amount-row input { flex: 1; }

	.max-btn {
		padding: 0 16px;
		background: var(--surface2);
		border: 1px solid var(--border);
		border-radius: 12px;
		color: var(--accent-light);
		font-size: 13px;
		font-weight: 700;
		font-family: inherit;
		cursor: pointer;
		flex-shrink: 0;
	}

	.max-btn:hover { border-color: var(--accent); }

	.error {
		color: var(--red);
		font-size: 13px;
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
		margin-top: 8px;
	}

	.btn-primary:hover { background: var(--accent-light); }
	.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

	/* Success */
	.success-view {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		text-align: center;
	}

	.success-icon {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--green);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28px;
		font-weight: 700;
		animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes pop {
		0% { transform: scale(0); opacity: 0; }
		100% { transform: scale(1); opacity: 1; }
	}

	.success-view h2 { color: var(--green); }

	.success-detail {
		font-size: 14px;
		color: var(--text-dim);
		max-width: 280px;
	}

	.success-view .btn-primary {
		width: auto;
		padding: 14px 32px;
		margin-top: 12px;
	}
</style>
