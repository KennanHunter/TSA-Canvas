<script context="module" lang="ts">
	import { query } from "$lib/functions/query";
	import { plugins } from "$lib/markdownPlugins";
	import type { ValueTypes } from "$zeus/index";
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
				value: await query(
					{
						Class: [
							{ classId: params.id },
							{
								name: true,
								owner: { name: true },
								hasPerms: true,
								description: true,
							},
						],
					},
					fetch,
				),
			},
		};
	}
</script>

<script lang="ts">
	export let value: { Class: ValueTypes["Class"] };
</script>

<h1>{value.Class.name}</h1>
<h3><em>Owned by</em> {value.Class.owner.name}</h3>

<Viewer value={value.Class.description} {plugins} />
