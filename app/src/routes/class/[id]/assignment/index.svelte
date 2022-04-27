<script lang="ts" context="module">
	import { page } from "$app/stores";
	import Card from "$lib/components/Card.svelte";
	import { query } from "$lib/functions/query";
	import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/internal";

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
				Class: (
					await query({
						Class: [
							{
								classId: params.id,
							},
							{
								hasPerms: true,
							},
						],
					})
				).Class,
			},
		};
	}
</script>

<script lang="ts">
	export let assignments;
	export let Class;
</script>

<h1>Assignments</h1>

<div>
	{#if Class.hasPerms}
		<a href={$page.url.href + "assignment/create"}
			><button>Create assignment</button></a
		>
	{/if}

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
	{:else}
		<h1>There doesn't appear to be any Assignments</h1>
	{/each}
</div>

<style lang="scss">
	@import "../../../../app.scss";
	div {
		display: flex;
		flex-wrap: wrap;
	}
</style>
