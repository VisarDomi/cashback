<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	type State = 'scanner' | 'manual' | 'result';

	interface ReceiptData {
		iic: string;
		tin: string;
		crtd: string;
		prc: string;
	}

	const SAMPLE: ReceiptData = {
		iic: '9A5D3E8F2B1C7040',
		tin: 'L62203504M',
		crtd: '2026-02-20T14:30:00',
		prc: '850.00'
	};

	let state = $state<State>('scanner');
	let receipt = $state<ReceiptData | null>(null);
	let manualInput = $state('');
	let manualError = $state('');
	let cameraError = $state('');
	let videoEl: HTMLVideoElement;
	let scanner: any = null;

	function parseFiskalizimiUrl(raw: string): ReceiptData | null {
		try {
			// Handle both full URLs and just the NIVF/IIC code
			const trimmed = raw.trim();

			// If it's a full fiskalizimi URL, parse the hash params
			if (trimmed.includes('efiskalizimi') || trimmed.includes('invoice-check')) {
				const hashPart = trimmed.split('#')[1];
				if (!hashPart) return null;
				const queryStr = hashPart.replace(/^\/verify\?/, '');
				const params = new URLSearchParams(queryStr);
				const iic = params.get('iic');
				const tin = params.get('tin');
				const crtd = params.get('crtd');
				const prc = params.get('prc');
				if (iic && tin && crtd && prc) {
					return { iic, tin, crtd, prc };
				}
			}

			// If it looks like just an IIC/NIVF code, use sample data with that code
			if (/^[A-Za-z0-9-]{8,}$/.test(trimmed)) {
				return { ...SAMPLE, iic: trimmed };
			}

			return null;
		} catch {
			return null;
		}
	}

	function showResult(data: ReceiptData) {
		receipt = data;
		state = 'result';
		stopScanner();
	}

	function trySample() {
		showResult(SAMPLE);
	}

	function goManual() {
		state = 'manual';
		manualError = '';
		manualInput = '';
		stopScanner();
	}

	function submitManual() {
		const parsed = parseFiskalizimiUrl(manualInput);
		if (parsed) {
			showResult(parsed);
		} else {
			manualError = 'URL ose NIVF i pavlefshëm';
		}
	}

	function scanAnother() {
		receipt = null;
		manualError = '';
		manualInput = '';
		state = 'scanner';
	}

	async function startScanner() {
		try {
			const QrScanner = (await import('qr-scanner')).default;
			scanner = new QrScanner(
				videoEl,
				(result: { data: string }) => {
					const parsed = parseFiskalizimiUrl(result.data);
					if (parsed) {
						showResult(parsed);
					}
				},
				{
					preferredCamera: 'environment',
					highlightScanRegion: true,
					highlightCodeOutline: true,
					maxScansPerSecond: 2,
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

	function formatDate(iso: string): string {
		try {
			const d = new Date(iso);
			return d.toLocaleDateString('sq-AL', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			}) + ' — ' + d.toLocaleTimeString('sq-AL', {
				hour: '2-digit',
				minute: '2-digit'
			});
		} catch {
			return iso;
		}
	}

	onMount(() => {
		if (state === 'scanner') startScanner();
	});

	onDestroy(() => {
		stopScanner();
	});

	// Restart scanner when returning to scanner state
	$effect(() => {
		if (state === 'scanner' && videoEl) {
			startScanner();
		}
	});
</script>

<div class="app">
	{#if state === 'scanner'}
		<div class="scanner-view">
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
		</div>

	{:else if state === 'manual'}
		<div class="manual-view">
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
					<p class="error">{manualError}</p>
				{/if}
			</div>

			<div class="actions">
				<button class="btn-primary" onclick={submitManual} disabled={!manualInput.trim()}>
					Verifiko
				</button>
				<button class="link-btn" onclick={scanAnother}>Kthehu te skaneri</button>
			</div>
		</div>

	{:else if state === 'result' && receipt}
		<div class="result-view">
			<div class="verified-badge">
				<span class="check-anim">✓</span>
				<h2>Fiskalizimi i verifikuar</h2>
			</div>

			<div class="card receipt-card">
				<h3>Fatura</h3>
				<div class="row">
					<span class="label">NIPT tregtari</span>
					<span class="value">{receipt.tin}</span>
				</div>
				<div class="row">
					<span class="label">Shuma</span>
					<span class="value amount">{Number(receipt.prc).toLocaleString('sq-AL')} LEK</span>
				</div>
				<div class="row">
					<span class="label">Data / ora</span>
					<span class="value">{formatDate(receipt.crtd)}</span>
				</div>
				<div class="row">
					<span class="label">NIVF</span>
					<span class="value mono">{receipt.iic}</span>
				</div>
			</div>

			<div class="card reward-card">
				<div class="reward-icon">🎁</div>
				<h3>Shpërblimi yt</h3>
				<p class="reward-amount">10% zbritje herën tjetër</p>
				<p class="reward-expiry">Vlefshmëri: 7 ditë</p>
			</div>

			<div class="actions">
				<button class="btn-primary" onclick={scanAnother}>Skano një tjetër</button>
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

	h3 {
		font-size: 16px;
		font-weight: 600;
		color: var(--accent-light);
		margin-bottom: 12px;
	}

	.subtitle {
		font-size: 15px;
		color: var(--text-dim);
		margin-bottom: 24px;
	}

	/* Scanner */
	.scanner-view {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.viewfinder {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		background: var(--surface);
		border-radius: 16px;
		overflow: hidden;
		margin-bottom: 24px;
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

	.error-icon {
		font-size: 32px;
	}

	.camera-error p {
		font-size: 14px;
		color: var(--text-dim);
	}

	/* Manual entry */
	.manual-view {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.input-group {
		margin-bottom: 24px;
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

	input[type='text']:focus {
		border-color: var(--accent);
	}

	input[type='text']::placeholder {
		color: var(--text-dim);
	}

	.error {
		color: var(--red);
		font-size: 13px;
		margin-top: 8px;
	}

	/* Result */
	.result-view {
		display: flex;
		flex-direction: column;
		flex: 1;
		gap: 16px;
	}

	.verified-badge {
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

	@keyframes pop {
		0% { transform: scale(0); opacity: 0; }
		100% { transform: scale(1); opacity: 1; }
	}

	.verified-badge h2 {
		color: var(--green);
	}

	.card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 14px;
		padding: 20px;
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

	.value.amount {
		color: var(--accent-light);
		font-weight: 700;
		font-size: 17px;
	}

	.value.mono {
		font-family: 'SF Mono', 'Fira Code', monospace;
		font-size: 12px;
		color: var(--text-dim);
		word-break: break-all;
	}

	/* Reward card */
	.reward-card {
		border-color: var(--green);
		background: #22c55e08;
		text-align: center;
	}

	.reward-icon {
		font-size: 32px;
		margin-bottom: 8px;
	}

	.reward-card h3 {
		color: var(--green);
	}

	.reward-amount {
		font-size: 20px;
		font-weight: 700;
		color: var(--text);
		margin-bottom: 4px;
	}

	.reward-expiry {
		font-size: 13px;
		color: var(--text-dim);
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

	.link-btn:hover {
		color: var(--accent-light);
	}
</style>
