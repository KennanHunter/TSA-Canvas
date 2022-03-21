<script lang="ts">
	import { query } from "$lib/query";

	import { onMount } from "svelte";

	let classes = [];

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
