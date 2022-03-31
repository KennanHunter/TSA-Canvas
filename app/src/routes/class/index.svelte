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
						id: true,
					},
					ownedClasses: {
						name: true,
						id: true,
					},
					taughtClasses: {
						name: true,
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
	import { query } from "$lib/query";
	import type { LoadInput,LoadOutput } from "@sveltejs/kit/types/internal";

	export let classes: { name: string; id: string }[] = [];
</script>

<svelte:head>
	<title>Class Dashboard</title>
</svelte:head>

<section>
	<ul>
		{#each classes as klass}
			<li>
				<div>
					<a href={"/class/" + klass.id}>{klass.name} </a>
				</div>
			</li>
		{:else}
			<h1>No classes</h1>
		{/each}
	</ul>
</section>

<aside>
	<a href="/class/create/"><button> Create Class </button> </a>
</aside>
