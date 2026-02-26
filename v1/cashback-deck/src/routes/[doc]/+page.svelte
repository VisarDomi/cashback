<script lang="ts">
	import { page } from '$app/state';
	import { docs } from '$lib/docs';
	import { marked } from 'marked';

	let slug = $derived(page.params.doc);
	let raw = $derived(docs[slug] ?? '');
	let html = $derived(raw ? marked.parse(raw) : '<p>Document not found.</p>');
</script>

<svelte:head>
	<title>{slug} - Cashback Platform Albania</title>
</svelte:head>

<a href="/" class="back">&larr; Back to slideshow</a>
<div class="content">
	<div class="markdown">
		{@html html}
	</div>
</div>

<style>
	:global(body) {
		overflow: auto;
	}

	.back {
		display: inline-block;
		margin: 24px 32px;
		color: var(--text-dim);
		text-decoration: none;
		font-size: 13px;
		font-weight: 500;
		padding: 6px 14px;
		border-radius: 6px;
		border: 1px solid var(--border);
		transition: all 0.15s;
	}

	.back:hover {
		color: var(--accent-light);
		border-color: var(--accent);
		background: rgba(99, 102, 241, 0.08);
	}

	.content {
		max-width: 860px;
		margin: 0 auto;
		padding: 0 32px 120px;
	}

	.markdown :global(h1) {
		font-size: 36px;
		font-weight: 800;
		letter-spacing: -1px;
		margin: 48px 0 16px;
		color: #f0f0fa;
		border-bottom: 1px solid var(--border);
		padding-bottom: 12px;
	}

	.markdown :global(h1:first-child) { margin-top: 0; }

	.markdown :global(h2) {
		font-size: 26px;
		font-weight: 700;
		letter-spacing: -0.5px;
		margin: 40px 0 12px;
		color: #e0e0f0;
	}

	.markdown :global(h3) {
		font-size: 19px;
		font-weight: 600;
		margin: 28px 0 8px;
		color: var(--accent-light);
	}

	.markdown :global(h4) {
		font-size: 16px;
		font-weight: 600;
		margin: 24px 0 8px;
		color: var(--text);
	}

	.markdown :global(p) {
		font-size: 16px;
		line-height: 1.75;
		margin: 12px 0;
		color: var(--text);
	}

	.markdown :global(ul),
	.markdown :global(ol) {
		margin: 12px 0;
		padding-left: 24px;
		list-style: revert;
	}

	.markdown :global(li) {
		font-size: 16px;
		line-height: 1.7;
		margin: 6px 0;
		color: var(--text);
		padding-left: 0;
	}

	.markdown :global(li::before) {
		display: none;
	}

	.markdown :global(li::marker) {
		color: var(--accent);
	}

	.markdown :global(strong) {
		color: #f0f0fa;
		font-weight: 600;
	}

	.markdown :global(a) {
		color: var(--accent-light);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: border-color 0.15s;
	}

	.markdown :global(a:hover) {
		border-bottom-color: var(--accent-light);
	}

	.markdown :global(code) {
		font-family: 'JetBrains Mono', 'SF Mono', Consolas, monospace;
		font-size: 14px;
		background: rgba(255, 255, 255, 0.06);
		padding: 2px 7px;
		border-radius: 4px;
		color: var(--accent-light);
	}

	.markdown :global(pre) {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 20px;
		margin: 16px 0;
		overflow-x: auto;
	}

	.markdown :global(pre code) {
		background: none;
		padding: 0;
		font-size: 14px;
		line-height: 1.6;
		color: var(--text-dim);
	}

	.markdown :global(blockquote) {
		border-left: 3px solid var(--accent);
		padding: 8px 20px;
		margin: 16px 0;
		background: rgba(99, 102, 241, 0.05);
		border-radius: 0 8px 8px 0;
	}

	.markdown :global(blockquote p) {
		color: var(--text-dim);
	}

	.markdown :global(hr) {
		border: none;
		border-top: 1px solid var(--border);
		margin: 32px 0;
	}

	.markdown :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 16px 0;
		font-size: 15px;
	}

	.markdown :global(th) {
		text-align: left;
		padding: 10px 14px;
		background: var(--surface);
		color: var(--accent-light);
		font-weight: 600;
		font-size: 13px;
		text-transform: uppercase;
		letter-spacing: 0.4px;
		border-bottom: 2px solid var(--border);
	}

	.markdown :global(td) {
		padding: 10px 14px;
		border-bottom: 1px solid var(--border);
		color: var(--text);
	}

	.markdown :global(tr:last-child td) {
		border-bottom: none;
	}

	.markdown :global(img) {
		max-width: 100%;
		border-radius: 8px;
	}
</style>
