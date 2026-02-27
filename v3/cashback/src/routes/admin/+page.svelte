<script lang="ts">
	import { onDestroy } from 'svelte';
	import { enhance } from '$app/forms';

	type View = 'scanner' | 'result' | 'error';

	let { form, data } = $props();

	let view = $state<View>('scanner');
	let videoEl: HTMLVideoElement;
	let scanner: any = null;
	let cameraError = $state('');
	let scanFormEl: HTMLFormElement;
	let rawInput: HTMLInputElement;
	let companyName = $state('');

	$effect(() => {
		if (form) {
			if (form.removed) {
				// Remove from list — stay on scanner view
				form = null;
			} else if (form.success) {
				view = 'result';
				stopScanner();
			} else if (form.error) {
				view = 'error';
				stopScanner();
			}
		}
	});

	function handleQrResult(data: string) {
		if (rawInput && scanFormEl) {
			stopScanner();
			rawInput.value = data;
			scanFormEl.requestSubmit();
		}
	}

	function scanAnother() {
		form = null;
		companyName = '';
		view = 'scanner';
	}

	async function startScanner() {
		try {
			const QrScanner = (await import('qr-scanner')).default;
			scanner = new QrScanner(
				videoEl,
				(result: { data: string }) => {
					handleQrResult(result.data);
				},
				{
					preferredCamera: 'environment',
					highlightScanRegion: true,
					highlightCodeOutline: true,
				}
			);
			await scanner.start();
			cameraError = '';
		} catch (err: any) {
			cameraError = err?.message || 'Kamera nuk u aktivizua';
		}
	}

	function stopScanner() {
		if (scanner) {
			scanner.stop();
			scanner.destroy();
			scanner = null;
		}
	}

	onDestroy(() => { stopScanner(); });

	$effect(() => {
		if (view === 'scanner' && videoEl) {
			startScanner();
		}
	});
</script>

<div class="admin-page">
	{#if view === 'scanner'}
		<h1>Regjistro kompani</h1>
		<p class="subtitle">Skano faturën QR për të lexuar NIPT-in</p>

		<!-- Hidden form for QR data submission -->
		<form
			method="POST"
			action="?/scan"
			use:enhance
			bind:this={scanFormEl}
			style="display: none;"
		>
			<input type="hidden" name="raw" bind:this={rawInput} value="" />
		</form>

		<div class="viewfinder">
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<video bind:this={videoEl} playsinline />
			{#if cameraError}
				<div class="camera-error">
					<span class="error-icon">⚠</span>
					<p>{cameraError}</p>
				</div>
			{/if}
			<div class="scan-corners">
				<span class="corner tl"></span>
				<span class="corner tr"></span>
				<span class="corner bl"></span>
				<span class="corner br"></span>
			</div>
		</div>

	{:else if view === 'result' && form?.success && form?.added}
		<div class="status-badge added">
			<span class="status-icon">✓</span>
			<h2>Kompania u regjistrua!</h2>
		</div>

		<div class="card">
			<div class="row">
				<span class="label">Emri</span>
				<span class="value">{form.company.logoEmoji} {form.company.name}</span>
			</div>
			<div class="row">
				<span class="label">NIPT</span>
				<span class="value mono">{form.company.tin}</span>
			</div>
			<div class="row">
				<span class="label">Cashback</span>
				<span class="value">{form.company.cashbackPercent}%</span>
			</div>
		</div>

		<div class="actions">
			<button class="btn-primary" onclick={scanAnother}>Skano një tjetër</button>
		</div>

	{:else if view === 'result' && form?.success && form?.exists}
		<div class="status-badge exists">
			<span class="status-icon">✓</span>
			<h2>Kompania ekziston</h2>
		</div>

		<div class="card">
			<div class="row">
				<span class="label">Emri</span>
				<span class="value">{form.company.logoEmoji} {form.company.name}</span>
			</div>
			<div class="row">
				<span class="label">NIPT</span>
				<span class="value mono">{form.company.tin}</span>
			</div>
			<div class="row">
				<span class="label">Cashback</span>
				<span class="value">{form.company.cashbackPercent}%</span>
			</div>
		</div>

		<div class="actions">
			<button class="btn-primary" onclick={scanAnother}>Skano një tjetër</button>
		</div>

	{:else if view === 'result' && form?.success && !form?.exists}
		<div class="status-badge new-company">
			<span class="status-icon new">+</span>
			<h2>Kompani e re</h2>
		</div>

		<div class="card">
			<div class="row">
				<span class="label">NIPT</span>
				<span class="value mono">{form.tin}</span>
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
			<input type="hidden" name="tin" value={form.tin} />
			<div class="input-group">
				<label for="company-name">Emri i kompanisë (opsional)</label>
				<input
					id="company-name"
					type="text"
					name="name"
					bind:value={companyName}
					placeholder={form.tin}
				/>
			</div>
			<div class="actions">
				<button class="btn-primary" type="submit">Regjistro</button>
				<button class="btn-secondary" type="button" onclick={scanAnother}>Anulo</button>
			</div>
		</form>

	{:else if view === 'error'}
		<div class="error-view">
			<span class="error-big">✕</span>
			<h2>{form?.error ?? 'Gabim'}</h2>
			<button class="btn-primary" onclick={scanAnother}>Provo prsëri</button>
		</div>
	{/if}
</div>

{#if data.companies.length > 0}
	<div class="company-list">
		<h2>Kompani të regjistruara ({data.companies.length})</h2>
		{#each data.companies as company}
			<div class="company-row">
				<span class="company-emoji">{company.logoEmoji}</span>
				<div class="company-info">
					<span class="company-name">{company.name}</span>
					<span class="company-detail">{company.tin} — {company.cashbackPercent}%</span>
				</div>
				<form method="POST" action="?/remove" use:enhance>
					<input type="hidden" name="tin" value={company.tin} />
					<button class="remove-btn" type="submit" title="Hiq">✕</button>
				</form>
			</div>
		{/each}
	</div>
{/if}

<style>
	.admin-page {
		display: flex;
		flex-direction: column;
		min-height: calc(100dvh - 100px);
	}

	h1 {
		font-size: 24px;
		font-weight: 800;
		letter-spacing: -0.5px;
		margin-bottom: 4px;
	}

	h2 { font-size: 20px; font-weight: 700; }

	.subtitle {
		font-size: 14px;
		color: var(--text-dim);
		margin-bottom: 20px;
	}

	/* Viewfinder */
	.viewfinder {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		background: var(--surface);
		border-radius: 16px;
		overflow: hidden;
		margin-bottom: 20px;
	}

	.viewfinder video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.scan-corners {
		position: absolute;
		inset: 20%;
		pointer-events: none;
	}

	.corner {
		position: absolute;
		width: 24px;
		height: 24px;
		border-color: var(--accent-light);
		border-style: solid;
		border-width: 0;
	}

	.corner.tl { top: 0; left: 0; border-top-width: 3px; border-left-width: 3px; border-top-left-radius: 8px; }
	.corner.tr { top: 0; right: 0; border-top-width: 3px; border-right-width: 3px; border-top-right-radius: 8px; }
	.corner.bl { bottom: 0; left: 0; border-bottom-width: 3px; border-left-width: 3px; border-bottom-left-radius: 8px; }
	.corner.br { bottom: 0; right: 0; border-bottom-width: 3px; border-right-width: 3px; border-bottom-right-radius: 8px; }

	.camera-error {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		background: var(--surface);
		padding: 24px;
		text-align: center;
	}

	.error-icon { font-size: 32px; }
	.camera-error p { font-size: 14px; color: var(--text-dim); }

	/* Status badges */
	.status-badge {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 16px;
	}

	.status-badge.exists h2 { color: var(--accent-light); }
	.status-badge.new-company h2 { color: var(--text); }
	.status-badge.added h2 { color: var(--green); }


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

	.status-icon.new {
		background: var(--accent-light);
		font-size: 26px;
	}

	.status-badge.added .status-icon {
		background: var(--green);
	}

	@keyframes pop {
		0% { transform: scale(0); opacity: 0; }
		100% { transform: scale(1); opacity: 1; }
	}

	/* Card */
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

	/* Add form */
	.add-form {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.input-group {
		margin-bottom: 20px;
	}

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

	/* Error */
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

	.error-view h2 { color: var(--red); font-size: 16px; }

	/* Shared */
	.actions {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: auto;
		padding-top: 16px;
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
		transition: border-color 0.15s;
	}

	.btn-secondary:hover { border-color: var(--accent); }

	/* Company list */
	.company-list {
		margin-top: 32px;
		padding-top: 24px;
		border-top: 1px solid var(--border);
	}

	.company-list h2 {
		font-size: 16px;
		font-weight: 700;
		margin-bottom: 12px;
	}

	.company-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		margin-bottom: 8px;
	}

	.company-emoji {
		font-size: 24px;
		flex-shrink: 0;
	}

	.company-info {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
	}

	.company-name {
		font-size: 14px;
		font-weight: 600;
	}

	.company-detail {
		font-size: 12px;
		color: var(--text-dim);
		margin-top: 2px;
	}

	.remove-btn {
		width: 32px;
		height: 32px;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: none;
		color: var(--text-dim);
		font-size: 14px;
		cursor: pointer;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.15s;
	}

	.remove-btn:hover {
		border-color: var(--red);
		color: var(--red);
		background: #ef444408;
	}
</style>
