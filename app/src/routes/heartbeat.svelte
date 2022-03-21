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

<section>
	<h1>
		{heartbeat ? "API is online" : "API is inaccessable"}
	</h1>
</section>
