<script lang="ts" context="module">
	import { mutation, query } from "$lib/functions/query";
	import type { ValueTypes } from "$zeus/index";
	import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/internal";
	import { onMount } from "svelte";

	export async function load({
		params,
		fetch,
		session,
		stuff,
	}: LoadInput): Promise<LoadOutput<Record<string, any>>> {
		return {
			props: {
				inviteId: (
					await mutation(
						{
							genInvite: [{ classId: params.id }, true],
						},
						fetch,
					)
				).genInvite,
			},
		};
	}
</script>

<script lang="ts">
	import { page } from "$app/stores";

	export let inviteId;

	onMount(() => {
		console.log(inviteId);
	});
</script>

<section>
	<div>
		<h1>Your Invite</h1>

		<a href={$page.url.origin + "/class/invite/" + inviteId}>
			{$page.url.origin + "/class/invite/" + inviteId}
		</a>
	</div>
</section>

<style>
	section {
		display: grid;
		grid-column: auto auto auto;
	}
	div {
		grid-column-start: 2;
	}
</style>
