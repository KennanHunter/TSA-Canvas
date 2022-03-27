<script lang="ts">
	import { page } from "$app/stores";
	import Loading from "$lib/Loading.svelte";

	import { query } from "$lib/query";

	import { onMount } from "svelte";

	// onMount(() => {
	// 	return
	// });
</script>

{#await query( { Class: [{ classId: $page.params.id }, { name: true, owner: { name: true } }] }, )}
	<Loading />
{:then value}
	<h1>{value.Class.name}</h1>
	<h3><em>Owned by</em> {value.Class.owner.name}</h3>
{/await}
