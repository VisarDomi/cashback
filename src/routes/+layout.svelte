<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Cashback — Skano faturën</title>
</svelte:head>

{@render children()}
