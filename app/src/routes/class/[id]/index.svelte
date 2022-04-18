<script context="module" lang="ts">
	import { query } from "$lib/functions/query";
	import type { ValueTypes } from "$zeus/index";

	import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/internal";

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
	import { page } from "$app/stores";

	export let value: { Class: ValueTypes["Class"] };
</script>

<h1>{value.Class.name}</h1>
<h3><em>Owned by</em> {value.Class.owner.name}</h3>

{#if value.Class.hasPerms}
	<a href={$page.url.href + "assignment/create"}
		><button>Create assignment</button></a
	>
{/if}
