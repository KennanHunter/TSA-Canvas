<script context="module" lang="ts">
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
								{ name: true, description: true },
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
	import { query } from "$lib/query";
	import type { ValueTypes } from "$zeus/index";
	import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/internal";

	export let assignment: ValueTypes["Assignment"];
</script>

<h1>{assignment.name}</h1>
<p>{assignment.description}</p>
