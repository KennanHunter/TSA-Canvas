<script lang="ts">
	import { goto } from "$app/navigation";

	import { query } from "$lib/query";
	import { onMount } from "svelte";

	let classes: { name: string }[] = [];

	onMount(async () => {
		const { self } = await query({
			self: {
				memberClasses: {
					name: true,
				},
				ownedClasses: {
					name: true,
				},
				taughtClasses: {
					name: true,
				},
			},
		});

		classes = [].concat(
			self.memberClasses,
			self.ownedClasses,
			self.taughtClasses,
		);
		console.log(classes);
		console.log(self.ownedClasses);
	});
</script>

<svelte:head>
	<title>Class Dashboard</title>
</svelte:head>

<section>
	<ul>
		{#each classes as klass}
			<li>
				<div>
					<hi>{klass.name} </hi>
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
