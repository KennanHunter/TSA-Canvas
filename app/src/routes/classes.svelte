<script lang="ts">
	import { query } from "$lib/query";

	import { onMount } from "svelte";

	let classes;
	onMount(async () => {
		classes = (
			await query({
				self: true,
			})
		).classes;
	});
</script>

<section>
	{classes}
</section>
