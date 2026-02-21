<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Cashback Biz</title>
</svelte:head>

{@render children()}
