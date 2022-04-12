<script lang="ts" context="module">
	import { page } from "$app/stores";
	import Image from "$lib/components/Image.svelte";
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
				owner: (
					await query(
						{
							queryFile: [
								{ id: params.fileid },
								{
									owner: {
										name: true,
									},
								},
							],
						},
						fetch,
					)
				).queryFile.owner,
			},
		};
	}
</script>

<script lang="ts">
	export let owner = {
		name: "",
	};
</script>

<div>
	<h1>{$page.params.fileid}</h1>
	<Image id={$page.params.fileid} />
	<p><strong>Uploaded By: </strong>{owner.name}</p>
</div>

<style>
	div {
		overflow: hidden;
		height: fit-content;
		text-align: center;
	}
</style>
