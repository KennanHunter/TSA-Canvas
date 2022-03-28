<script>
	import { query } from "$lib/query";
	import Error from "$lib/Error.svelte";
</script>

<h1>Settings</h1>
{#await query({ self: { name: true } }) then value}
	<h1>{value.self.name}</h1>
{:catch error}
	<Error {error} />
{/await}

<input />
