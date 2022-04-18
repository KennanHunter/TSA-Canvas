<script context="module" lang="ts">
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
<h2>Due At {new Date(assignment.dueAt).toDateString()}</h2>
<p>{assignment.description}</p>

<a href="submission/">
	<button> View Submission </button>
</a>
