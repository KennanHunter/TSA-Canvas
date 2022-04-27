<script context="module" lang="ts">
	import { query } from "$lib/functions/query";

	import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/internal";

	export async function load({
		params,
		fetch,
	}: LoadInput): Promise<LoadOutput<Record<string, any>>> {
		return {
			props: {
				members: (
					await query(
						{
							Class: [
								{
									classId: params.id,
								},
								{
									owner: {
										name: true,
									},
									members: {
										name: true,
									},
								},
							],
						},
						fetch,
					)
				).Class,
			},
		};
	}
</script>

<script lang="ts">
	import { page } from "$app/stores";

	export let members: {
		owner: { name: string };
		members: { name: string }[];
	};
</script>

<h1>Member List</h1>
<h2>Owned by {members.owner.name}</h2>
<ul>
	{#each members.members as member}
		<li>{member.name}</li>
	{:else}
		<p>
			There doesn't appear to be any members, you can add some at
			<a href={"/class/" + $page.params.id + "/invite"}>the invite page</a
			>
		</p>
	{/each}
</ul>

<style>
	a {
		color: aquamarine;
		text-decoration: underline;
	}
</style>
