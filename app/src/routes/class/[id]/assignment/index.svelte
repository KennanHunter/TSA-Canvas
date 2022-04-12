<script lang="ts" context="module">
	import { query } from "$lib/functions/query";
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
										class: {
											owner: {
												name: true,
											},
										},
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
	import { page } from "$app/stores";

	export let assignments: ValueTypes["Assignment"][];
</script>

{#each assignments as assignment}
	<div>
		<a href={$page.url.href + assignment.id}>
			<h2>
				{assignment.name}
			</h2>
		</a>
		<p>{assignment.class.owner.name}</p>
	</div>
{/each}
