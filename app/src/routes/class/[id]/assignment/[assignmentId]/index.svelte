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
	import AssignmentView from "$lib/components/AssignmentView.svelte";

	export let assignment;
</script>

<AssignmentView {assignment} />
