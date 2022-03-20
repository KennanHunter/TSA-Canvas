<script lang="ts">
	import { query } from "$lib/query";

	import { onMount } from "svelte";

	let heartbeat: boolean = false;
	onMount(async () => {
		console.log("on mount activated");
		heartbeat = (
			await query({
				heartbeat: true,
			})
		).heartbeat;
		console.log("await done");
	});
</script>

<section>
	<h1>
		{heartbeat ? "API is online" : "API is inaccessable"}
	</h1>
</section>
