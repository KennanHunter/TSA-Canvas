<script lang="ts" context="module">
	export async function load({
		params,
		fetch,
		session,
		stuff,
	}: LoadInput): Promise<LoadOutput<Record<string, any>>> {
		const { self } = await query(
			{
				self: {
					memberClasses: {
						name: true,
						owner: {
							name: true,
						},
						id: true,
					},
					ownedClasses: {
						name: true,
						owner: {
							name: true,
						},
						id: true,
					},
					taughtClasses: {
						name: true,
						owner: {
							name: true,
						},
						id: true,
					},
				},
			},
			fetch,
		);

		return {
			props: {
				classes: [].concat(
					self.memberClasses,
					self.ownedClasses,
					self.taughtClasses,
				),
			},
		};
	}
</script>

<script lang="ts">
	import Card from "$lib/components/Card.svelte";
	import { query } from "$lib/functions/query";
	import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/internal";

	export let classes: {
		name: string;
		id: string;
		owner: { name: string };
	}[] = [];
</script>

<svelte:head>
	<title>Class Dashboard</title>
</svelte:head>

<aside>
	<a href="/class/create/"><button> Create Class </button> </a>
</aside>

<section>
	{#each classes as klass}
		<div>
			<a href={"/class/" + klass.id}>
				<Card
					value={{
						Title: klass.name,
						PrimarySubtext: klass.owner.name,
					}}
				/>
			</a>
		</div>
	{:else}
		<h1>No classes</h1>
	{/each}
</section>

<style>
	section {
		display: flex;
	}
	button {
		padding: 1em;
		font-size: 1em;
	}
</style>
