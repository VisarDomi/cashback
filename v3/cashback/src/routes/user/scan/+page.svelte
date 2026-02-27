<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { enhance } from '$app/forms';

	let videoEl: HTMLVideoElement;
	let scanner: any = null;
	let cameraError = $state('');
	let processFormEl: HTMLFormElement;
	let rawInput: HTMLInputElement;

	function handleQrResult(data: string) {
		if (rawInput && processFormEl) {
			stopScanner();
			rawInput.value = data;
			processFormEl.requestSubmit();
		}
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

	onMount(() => { startScanner(); });
	onDestroy(() => { stopScanner(); });
</script>

<div class="scan-page">
	<h1>Skano faturën</h1>
	<p class="subtitle">Drejto kamerën te kodi QR i faturës</p>

	<form
		method="POST"
		action="?/process"
		use:enhance
		bind:this={processFormEl}
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
				<a href="/user/scan/manual" class="link-btn">Shkruaj NIVF manualisht</a>
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
		<form method="POST" action="?/sample" use:enhance>
			<button class="btn-primary" type="submit">Provo me shembull</button>
		</form>
		<form method="POST" action="?/duplicate" use:enhance>
			<button class="btn-secondary" type="submit">Provo me faturë të skanuar njëherë</button>
		</form>
		<a href="/user/scan/manual" class="link-btn">Shkruaj NIVF manualisht</a>
	</div>
</div>

<style>
	.scan-page {
		display: flex;
		flex-direction: column;
	}

	h1 {
		font-size: 24px;
		font-weight: 800;
		letter-spacing: -0.5px;
		margin-bottom: 4px;
	}

	.subtitle {
		font-size: 14px;
		color: var(--text-dim);
		margin-bottom: 20px;
	}

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

	.actions {
		display: flex;
		flex-direction: column;
		gap: 12px;
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
		text-align: center;
	}

	.link-btn:hover { color: var(--accent-light); }
</style>
