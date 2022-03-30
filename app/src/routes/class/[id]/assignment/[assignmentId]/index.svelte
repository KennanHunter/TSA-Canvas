<script>
	import { page } from "$app/stores";

	import Loading from "$lib/Loading.svelte";
	import { query } from "$lib/query";
</script>

{#await query( { Assignment: [{ assignmentId: $page.params.assignmentId }, { name: true, description: true }] }, )}
	<Loading />
{:then value}
	<h1>{value.Assignment.name}</h1>
	<p>{value.Assignment.description}</p>
{/await}
