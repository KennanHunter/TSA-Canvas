<script context="module" lang="ts">
	import { query } from "$lib/functions/query";
	import { plugins } from "$lib/markdownPlugins";
	import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/internal";
	import { Viewer } from "bytemd";

	export async function load({
		params,
		fetch,
		session,
		stuff,
	}: LoadInput): Promise<LoadOutput<Record<string, any>>> {
		return {
			props: {
				assignment: (
					await query(
						{
							Assignment: [
								{ assignmentId: params.assignmentId },
								{ name: true, description: true, dueAt: true },
							],
						},
						fetch,
					)
				).Assignment,
			},
		};
	}
</script>

<script lang="ts">
	export let assignment;
</script>

<h1>{assignment.name}</h1>
{#if assignment.dueAt}
	<h2>Due At {new Date(assignment.dueAt).toDateString()}</h2>
{:else}
	<h2>No Specified Due Date</h2>
{/if}
<div class="description">
	<Viewer value={assignment.description} {plugins} />
</div>

<a href="submission/">
	<button> View Submission </button>
</a>
