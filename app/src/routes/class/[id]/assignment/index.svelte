<script lang="ts" context="module">
	import { query } from "$lib/query";
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
				assignments: (
					await query(
						{
							Class: [
								{
									classId: params.id,
								},
								{
									id: true,
									assignments: {
										id: true,
										name: true,
									},
								},
							],
						},
						fetch,
					)
				).Class.assignments,
			},
		};
	}
</script>

<script lang="ts">
	export let assignments: ValueTypes["Assignment"][];
	console.log(assignments);
</script>

{#each assignments as assignment}
	{assignment.name}
{/each}
