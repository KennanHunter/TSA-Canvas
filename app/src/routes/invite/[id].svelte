<script context="module" lang="ts">
	export async function load({
		params,
		fetch,
		session,
		stuff,
	}: LoadInput): Promise<LoadOutput<Record<string, any>>> {
		return {
			props: {
				classInformation: (
					await query({
						getInvite: [
							{
								inviteId: params.id,
							},
							{
								name: true,
							},
						],
					})
				).getInvite,
			},
		};
	}
</script>

<script lang="ts">
	import { page } from "$app/stores";
	import { query, mutation } from "$lib/functions/query";

	import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/internal";
	import { onMount } from "svelte";

	interface ClassInformation {
		name: String;
	}

	export let classInformation: ClassInformation = {
		name: "",
	};

	function acceptInvite() {
		mutation({
			acceptInvite: [
				{
					inviteId: $page.params.id,
				},
				{},
			],
		});
	}
</script>

<h1>You've been invited to: {classInformation.name || ""}</h1>

<button on:click={acceptInvite}>Accept</button>
