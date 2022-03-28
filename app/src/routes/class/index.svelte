<script lang="ts">
	import { goto } from "$app/navigation";

	import { query } from "$lib/query";
	import { onMount } from "svelte";

	let classes: { name: string; id: string }[] = [];

	onMount(async () => {
		const { self } = await query({
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
					<a href={"/class/" + klass.id}>
						<hi>{klass.name} </hi>
					</a>
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
