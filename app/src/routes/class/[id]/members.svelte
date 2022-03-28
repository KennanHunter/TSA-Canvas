<script>
	import { page } from "$app/stores";
	import Error from "$lib/Error.svelte";

	import Loading from "$lib/Loading.svelte";
	import { query } from "$lib/query";
</script>

{#await query( { Class: [{ classId: $page.params.id }, { members: { name: true } }] }, )}
	<Loading />
{:then value}
	{#each value.Class.members as member}
		{member.name}
	{:else}
		<Error message="Class does not contain any members" />
	{/each}
{/await}
