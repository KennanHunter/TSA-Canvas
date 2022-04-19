<script>
	import { query } from "$lib/functions/query";
	import Error from "$lib/placeholders/Error.svelte";
	import { setTitle } from "$lib/stores";

	setTitle("Settings");
</script>

<h1>Settings</h1>
{#await query({ self: { name: true } }) then value}
	<h1>{value.self.name}</h1>
{:catch}
	<Error />
{/await}

<input />
