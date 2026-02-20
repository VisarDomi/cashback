<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	type State = 'input' | 'valid' | 'invalid';

	interface Reward {
		discount: string;
		maxLek: number;
		expiresIn: string;
		merchant: string;
	}

	function generateCode(iic: string): string {
		let hash = 0;
		for (let i = 0; i < iic.length; i++) {
			hash = ((hash << 5) - hash + iic.charCodeAt(i)) | 0;
		}
		const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
		let code = '';
		let h = Math.abs(hash);
		for (let i = 0; i < 6; i++) {
			code += chars[h % chars.length];
			h = Math.floor(h / chars.length) || (h + 7);
		}
		return code;
	}

	const SAMPLE_IIC = '9A5D3E8F2B1C7040';
	const SAMPLE_CODE = generateCode(SAMPLE_IIC);

	const REWARDS: Record<string, Reward> = {
		[SAMPLE_CODE]: {
			discount: '10%',
			maxLek: 500,
			expiresIn: '7 ditë',
			merchant: 'Cafe X'
		}
	};

	let state = $state<State>('input');
	let code = $state('');
	let reward = $state<Reward | null>(null);

	function verify() {
		const normalized = code.trim().toUpperCase();
		const found = REWARDS[normalized];
		if (found) {
			reward = found;
			state = 'valid';
		} else {
			state = 'invalid';
		}
	}

	function reset() {
		code = '';
		reward = null;
		state = 'input';
		// Clear URL params
		history.replaceState(null, '', '/verify');
	}

	function handleInput(e: Event) {
		const input = e.target as HTMLInputElement;
		code = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
	}

	// Auto-verify if opened via QR code URL
	onMount(() => {
		const urlCode = page.url.searchParams.get('code');
		if (urlCode) {
			code = urlCode.toUpperCase();
			verify();
		}
	});
</script>

<div class="app">
	{#if state === 'input'}
		<div class="verify-view">
			<div class="header">
				<span class="header-icon">🏪</span>
				<h1>Verifiko kodin</h1>
				<p class="subtitle">Shkruaj kodin 6-shkronjësh të klientit</p>
			</div>

			<div class="code-input-group">
				<input
					type="text"
					inputmode="text"
					autocapitalize="characters"
					maxlength="6"
					value={code}
					oninput={handleInput}
					onkeydown={(e) => e.key === 'Enter' && code.length === 6 && verify()}
					placeholder="P.sh. {SAMPLE_CODE}"
					class="code-input"
				/>
				<p class="input-hint">Kodi gjendet në ekranin e klientit</p>
			</div>

			<div class="actions">
				<button class="btn-primary" onclick={verify} disabled={code.length !== 6}>
					Verifiko
				</button>
			</div>
		</div>

	{:else if state === 'valid' && reward}
		<div class="result-view">
			<div class="verified-badge">
				<span class="check-anim">✓</span>
				<h2>I vlefshëm</h2>
			</div>

			<div class="card valid-card">
				<div class="row">
					<span class="label">Zbritje</span>
					<span class="value highlight">{reward.discount}</span>
				</div>
				<div class="row">
					<span class="label">Max</span>
					<span class="value">{reward.maxLek} LEK</span>
				</div>
				<div class="row">
					<span class="label">Biznesi</span>
					<span class="value">{reward.merchant}</span>
				</div>
				<div class="row">
					<span class="label">Skadon për</span>
					<span class="value">{reward.expiresIn}</span>
				</div>
				<div class="row">
					<span class="label">Kodi</span>
					<span class="value mono">{code}</span>
				</div>
			</div>

			<div class="instruction-card card">
				<p>Apliko zbritjen manualisht në kasë.</p>
			</div>

			<div class="actions">
				<button class="btn-primary" onclick={reset}>Verifiko një kod tjetër</button>
			</div>
		</div>

	{:else if state === 'invalid'}
		<div class="result-view">
			<div class="invalid-badge">
				<span class="x-anim">✕</span>
				<h2>I pavlefshëm</h2>
			</div>

			<div class="card invalid-card">
				<p>Kodi <strong>{code}</strong> nuk u gjet ose ka skaduar.</p>
				<p class="dim">Kontrollo përsëri kodin me klientin.</p>
			</div>

			<div class="actions">
				<button class="btn-primary" onclick={reset}>Provo përsëri</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.app {
		max-width: 420px;
		margin: 0 auto;
		padding: calc(24px + env(safe-area-inset-top)) 20px 24px;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}

	h1 {
		font-size: 28px;
		font-weight: 800;
		letter-spacing: -0.5px;
		margin-bottom: 4px;
	}

	h2 {
		font-size: 22px;
		font-weight: 700;
	}

	.subtitle {
		font-size: 15px;
		color: var(--text-dim);
		margin-bottom: 24px;
	}

	/* Header */
	.header {
		text-align: center;
		padding: 32px 0 24px;
	}

	.header-icon {
		font-size: 48px;
		display: block;
		margin-bottom: 12px;
	}

	.header .subtitle {
		margin-bottom: 0;
	}

	/* Code input */
	.verify-view {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.code-input-group {
		margin-bottom: 24px;
	}

	.code-input {
		width: 100%;
		padding: 18px 16px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		color: var(--text);
		font-family: 'SF Mono', 'Fira Code', monospace;
		font-size: 28px;
		font-weight: 700;
		letter-spacing: 8px;
		text-align: center;
		text-transform: uppercase;
		outline: none;
		transition: border-color 0.15s;
	}

	.code-input:focus {
		border-color: var(--accent);
	}

	.code-input::placeholder {
		color: var(--text-dim);
		font-size: 16px;
		letter-spacing: 4px;
		font-weight: 400;
	}

	.input-hint {
		font-size: 12px;
		color: var(--text-dim);
		text-align: center;
		margin-top: 8px;
	}

	/* Result */
	.result-view {
		display: flex;
		flex-direction: column;
		flex: 1;
		gap: 16px;
	}

	.verified-badge, .invalid-badge {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px 0;
	}

	.check-anim {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: var(--green);
		color: white;
		font-size: 24px;
		font-weight: 700;
		animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.verified-badge h2 {
		color: var(--green);
	}

	.x-anim {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: var(--red);
		color: white;
		font-size: 24px;
		font-weight: 700;
		animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.invalid-badge h2 {
		color: var(--red);
	}

	@keyframes pop {
		0% { transform: scale(0); opacity: 0; }
		100% { transform: scale(1); opacity: 1; }
	}

	.card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 14px;
		padding: 20px;
	}

	.valid-card {
		border-color: var(--green);
		background: #22c55e08;
	}

	.invalid-card {
		border-color: var(--red);
		background: #ef444408;
	}

	.invalid-card p {
		font-size: 15px;
		line-height: 1.6;
	}

	.instruction-card p {
		font-size: 14px;
		color: var(--text-dim);
		text-align: center;
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 8px 0;
		border-bottom: 1px solid var(--border);
	}

	.row:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.row:first-of-type {
		padding-top: 0;
	}

	.label {
		font-size: 13px;
		color: var(--text-dim);
		flex-shrink: 0;
		margin-right: 12px;
	}

	.value {
		font-size: 15px;
		font-weight: 500;
		text-align: right;
	}

	.value.highlight {
		color: var(--green);
		font-weight: 700;
		font-size: 18px;
	}

	.value.mono {
		font-family: 'SF Mono', 'Fira Code', monospace;
		font-size: 13px;
		color: var(--text-dim);
	}

	.dim {
		color: var(--text-dim);
		margin-top: 4px;
	}

	/* Buttons */
	.actions {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: auto;
		padding-top: 16px;
		padding-bottom: env(safe-area-inset-bottom, 16px);
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

	.btn-primary:hover {
		background: var(--accent-light);
	}

	.btn-primary:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
