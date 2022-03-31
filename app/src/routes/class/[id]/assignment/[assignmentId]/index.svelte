<script context="module" lang="ts">
	export async function load({
		params,
		fetch,
		session,
		stuff,
	}: LoadInput): Promise<LoadOutput<Record<string, any>>> {
		return {
			props: {
				value: query(
					{
						Assignment: [
							{ assignmentId: params.assignmentId },
							{ name: true, description: true },
						],
					},
					fetch,
				),
			},
		};
	}
</script>

<script lang="ts">
	import { query } from "$lib/query";
	import type { ValueTypes } from "$zeus/index";
	import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/internal";

	export let value: { Assignment: ValueTypes["Assignment"] };
</script>

<h1>{value.Assignment.name}</h1>
<p>{value.Assignment.description}</p>
