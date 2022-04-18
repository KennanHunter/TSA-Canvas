<script lang="ts" context="module">
	import { page } from "$app/stores";
	import Image from "$lib/components/Image.svelte";
	import { query, queryInit } from "$lib/functions/query";
	import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/internal";
	import { onMount } from "svelte";

	export async function load({
		params,
		fetch,
		session,
		stuff,
		url,
	}: LoadInput): Promise<LoadOutput<Record<string, any>>> {
		let data = await query(
			{
				getSubmission: [
					{
						assignmentId: params.assignmentId,
					},
					{
						submittedAt: true,
						grade: true,
					},
				],
			},
			fetch,
		);

		console.log("data value");

		console.log(data);
		if (data.getSubmission) {
			return {
				props: {
					submission: data.getSubmission,
				},
			};
		} else {
			return {
				status: 302,
				redirect: "create",
			};
		}
	}
</script>

<script lang="ts">
	export let submission = {};
</script>

<div>
	<h1>{submission}</h1>
</div>

<style>
</style>
