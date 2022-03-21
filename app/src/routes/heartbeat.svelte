<script lang="ts">
	import { query } from "$lib/query";

	import { onMount } from "svelte";

	let heartbeat: boolean = false;
	onMount(async () => {
		heartbeat = (
			await query({
				heartbeat: true,
			})
		).heartbeat;
	});
</script>

<svelte:head>
	<title>heartbeat</title>
</svelte:head>

<section>
	<h1>
		{heartbeat ? "API is online" : "API is inaccessible"}
	</h1>
</section>
