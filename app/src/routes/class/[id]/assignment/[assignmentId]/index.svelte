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
		let data = (
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
		).Assignment;

		data.dueAt =
			new Date(Math.floor(data.dueAt)).toDateString() +
			" at " +
			new Date(Math.floor(data.dueAt)).toLocaleTimeString();

		return {
			props: {
				assignment: data,
			},
		};
	}
</script>

<script lang="ts">
	export let assignment;
</script>

<AssignmentView {assignment} />
