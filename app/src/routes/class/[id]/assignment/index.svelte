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

	export let assignments;
</script>

<section>
	{#each assignments as assignment}
		<a href={$page.url.href + assignment.id}>
			<div class="outer">
				<h2>
					{assignment.name}
				</h2>
				<div class="bar">
					<p>{assignment.class.owner.name}</p>
					{#if assignment.dueAt}
						<p>
							<em>Due At</em>
							{new Date(assignment.dueAt).toDateString()}
						</p>
					{/if}
				</div>
			</div>
		</a>
	{/each}
</section>

<style lang="scss">
	@import "../../../../app.scss";
	section {
		display: flex;
	}
	.outer {
		border: 0.2em solid $secondary-color;
		border-radius: 0.4em;
		padding: 1em;
		margin: 1em;
	}
	.outer:hover {
		h2 {
			font-weight: 900;
		}
		p {
			font-weight: 700;
		}
		border: 0.4em solid $secondary-color;
	}
	.bar {
		display: flex;
		justify-content: space-between;
	}
</style>
