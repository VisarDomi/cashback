<script lang="ts">
	import { onDestroy } from 'svelte';
	import { parseFiskalizimiUrl, getSample, type ReceiptData } from '$lib/receipt/parser.ts';
	import { bank } from '$lib/bank-api/mock-bank.ts';
	import { getAccountId } from '$lib/auth/auth.svelte.ts';
	import { formatCurrency, formatDate } from '$lib/format.ts';

	type View = 'scanner' | 'manual' | 'result' | 'error';

	let view = $state<View>('scanner');
	let videoEl: HTMLVideoElement;
	let scanner: any = null;
	let cameraError = $state('');
	let manualInput = $state('');
	let manualError = $state('');

	// Result state
	let resultReceipt = $state<{ iic: string; tin: string; total: number; cashback: number; date: string } | null>(null);
	let errorMsg = $state('');

	function processScannedReceipt(data: ReceiptData) {
		const userId = getAccountId();
		if (!userId) return;

		// Check duplicate
		if (bank.isReceiptProcessed(data.iic)) {
			errorMsg = 'Kjo faturë është skanuar më parë';
			view = 'error';
			return;
		}

		// Find company by TIN
		const company = bank.getCompanyByTin(data.tin);
		if (!company) {
			errorMsg = 'Kompania nuk është regjistruar në platformë';
			view = 'error';
			return;
		}

		const totalAmount = parseFloat(data.prc);
		if (isNaN(totalAmount) || totalAmount <= 0) {
			errorMsg = 'Shuma e faturës nuk është e vlefshme';
			view = 'error';
			return;
		}

		// Process receipt and credit cashback
		const receipt = bank.processReceipt(userId, company.id, data.iic, data.tin, totalAmount, data.crtd);
		bank.creditCashback(receipt);

		resultReceipt = {
			iic: data.iic,
			tin: data.tin,
			total: totalAmount,
			cashback: receipt.cashbackAmount,
			date: data.crtd,
		};
		view = 'result';
		stopScanner();
	}

	function trySample() {
		processScannedReceipt(getSample());
	}

	function goManual() {
		view = 'manual';
		manualError = '';
		manualInput = '';
		stopScanner();
	}

	function submitManual() {
		const parsed = parseFiskalizimiUrl(manualInput);
		if (parsed) {
			processScannedReceipt(parsed);
		} else {
			manualError = 'URL ose NIVF i pavlefshëm';
		}
	}

	function scanAnother() {
		resultReceipt = null;
		errorMsg = '';
		manualError = '';
		manualInput = '';
		view = 'scanner';
	}

	async function startScanner() {
		try {
			const QrScanner = (await import('qr-scanner')).default;
			scanner = new QrScanner(
				videoEl,
				(result: { data: string }) => {
					const parsed = parseFiskalizimiUrl(result.data);
					if (parsed) processScannedReceipt(parsed);
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

<div class="scan-page">
	{#if view === 'scanner'}
		<h1>Skano faturën</h1>
		<p class="subtitle">Drejto kamerën te kodi QR i faturës</p>

		<div class="viewfinder">
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<video bind:this={videoEl} playsinline />
			{#if cameraError}
				<div class="camera-error">
					<span class="error-icon">⚠</span>
					<p>{cameraError}</p>
					<button class="link-btn" onclick={goManual}>Shkruaj NIVF manualisht</button>
				</div>
			{/if}
			<div class="scan-corners">
				<span class="corner tl"></span>
				<span class="corner tr"></span>
				<span class="corner bl"></span>
				<span class="corner br"></span>
			</div>
		</div>

		<div class="actions">
			<button class="btn-primary" onclick={trySample}>Provo me shembull</button>
			<button class="link-btn" onclick={goManual}>Shkruaj NIVF manualisht</button>
		</div>

	{:else if view === 'manual'}
		<h1>Vendos NIVF</h1>
		<p class="subtitle">Shkruaj kodin NIVF ose ngjit URL-në e fiskalizimit</p>

		<div class="input-group">
			<input
				type="text"
				bind:value={manualInput}
				placeholder="NIVF ose URL e fiskalizimit..."
				onkeydown={(e) => e.key === 'Enter' && submitManual()}
			/>
			{#if manualError}
				<p class="field-error">{manualError}</p>
			{/if}
		</div>

		<div class="actions">
			<button class="btn-primary" onclick={submitManual} disabled={!manualInput.trim()}>
				Verifiko
			</button>
			<button class="link-btn" onclick={scanAnother}>Kthehu te skaneri</button>
		</div>

	{:else if view === 'result' && resultReceipt}
		<div class="verified-badge">
			<span class="check-anim">✓</span>
			<h2>Cashback i kredituar!</h2>
		</div>

		<div class="card receipt-card">
			<h3>Fatura</h3>
			<div class="row">
				<span class="label">NIPT</span>
				<span class="value">{resultReceipt.tin}</span>
			</div>
			<div class="row">
				<span class="label">Shuma</span>
				<span class="value amount">{formatCurrency(resultReceipt.total)}</span>
			</div>
			<div class="row">
				<span class="label">Data</span>
				<span class="value">{formatDate(resultReceipt.date)}</span>
			</div>
			<div class="row">
				<span class="label">NIVF</span>
				<span class="value mono">{resultReceipt.iic}</span>
			</div>
		</div>

		<div class="card cashback-card">
			<div class="cashback-icon">✓</div>
			<span class="cashback-label">Cashback i fituar</span>
			<span class="cashback-amount">+{formatCurrency(resultReceipt.cashback)}</span>
			<span class="cashback-hint">Kredituar në portofolin tuaj</span>
		</div>

		<div class="actions">
			<button class="btn-primary" onclick={scanAnother}>Skano një tjetër</button>
		</div>

	{:else if view === 'error'}
		<div class="error-view">
			<span class="error-big">✕</span>
			<h2>{errorMsg}</h2>
			<button class="btn-primary" onclick={scanAnother}>Provo përsëri</button>
		</div>
	{/if}
</div>

<style>
	.scan-page {
		display: flex;
		flex-direction: column;
		min-height: calc(100dvh - 140px);
	}

	h1 {
		font-size: 24px;
		font-weight: 800;
		letter-spacing: -0.5px;
		margin-bottom: 4px;
	}

	h2 { font-size: 20px; font-weight: 700; }

	h3 {
		font-size: 14px;
		font-weight: 600;
		color: var(--accent-light);
		margin-bottom: 10px;
	}

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

	/* Manual */
	.input-group { margin-bottom: 20px; }

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
	.field-error { color: var(--red); font-size: 13px; margin-top: 8px; }

	/* Result */
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
	.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

	.link-btn {
		background: none;
		border: none;
		color: var(--text-dim);
		font-size: 14px;
		font-family: inherit;
		cursor: pointer;
		padding: 8px;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.link-btn:hover { color: var(--accent-light); }
</style>
