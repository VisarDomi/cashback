<script lang="ts">
	import { enhance } from '$app/forms';

	let manualInput = $state('');
</script>

<div class="scan-page">
	<h1>Vendos NIVF</h1>
	<p class="subtitle">Shkruaj kodin NIVF ose ngjit URL-në e fiskalizimit</p>

	<form method="POST" action="/user/scan?/process" use:enhance class="manual-form">
		<div class="input-group">
			<input
				type="text"
				name="raw"
				bind:value={manualInput}
				placeholder="NIVF ose URL e fiskalizimit..."
			/>
		</div>

		<div class="actions">
			<button class="btn-primary" type="submit" disabled={!manualInput.trim()}>
				Verifiko
			</button>
			<a href="/user/scan" class="link-btn">Kthehu te skaneri</a>
		</div>
	</form>
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

	.manual-form {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

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
		text-align: center;
	}

	.link-btn:hover { color: var(--accent-light); }
</style>
