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
					(
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
											dueAt: true,
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
					).Class.assignments as {
						id: number;
						name: string;
						dueAt: number;
					}[]
				).sort((a, b) => a.dueAt - b.dueAt),
			},
		};
	}
</script>

<script lang="ts">
	import { page } from "$app/stores";
	import Card from "$lib/components/Card.svelte";

	export let assignments;
</script>

<h1>Assignments</h1>

<div>
	{#each assignments as assignment}
		<a href={$page.url.href + assignment.id}>
			<Card
				value={{
					Title: assignment.name,
					PrimarySubtext: assignment.class.owner.name,
					SecondarySubtext: new Date(assignment.dueAt).toDateString(),
				}}
			/>
		</a>
	{/each}
</div>

<style lang="scss">
	@import "../../../../app.scss";
	div {
		display: flex;
		flex-wrap: wrap;
	}
</style>
