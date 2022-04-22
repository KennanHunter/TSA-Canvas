<script context="module" lang="ts">
	import AssignmentView from "$lib/components/AssignmentView.svelte";
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
								{
									name: true,
									description: true,
									dueAt: true,
									class: {
										hasPerms: true,
									},
								},
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

<AssignmentView {assignment} />
