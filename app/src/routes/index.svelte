<script context="module" lang="ts">
	interface Assignment {
		name: string;
		dueAt: number;
		id: string;
		class: {
			name: string;
			id: string;
		};
	}

	export async function load({ url, fetch }: LoadInput) {
		let selfQuery = await query(
			{
				self: {
					name: true,
					memberClasses: {
						id: true,
						name: true,
						assignments: {
							name: true,
							dueAt: true,
							id: true,
							class: {
								name: true,
								id: true,
							},
						},
					},
					ownedClasses: {
						id: true,
						name: true,
					},
				},
			},
			fetch,
		);

		console.log(selfQuery);

		let assignmentArray: Assignment[] = [];
		selfQuery.self.memberClasses.forEach((element) => {
			element.assignments.forEach((assignment) => {
				assignmentArray.push(assignment);
			});
		});

		assignmentArray = assignmentArray
			.filter((value) => {
				return value.dueAt;
			})
			.sort((a, b) => a.dueAt - b.dueAt);

		console.log(assignmentArray);
		return {
			props: {
				selfQuery: selfQuery.self,
				assignments: assignmentArray,
			},
		};
	}
</script>

<script lang="ts">
	import { query } from "$lib/functions/query";
	import { setTitle } from "$lib/stores";
	import type { LoadInput } from "@sveltejs/kit/types/internal";

	setTitle();

	export let assignments: Assignment[];
	export let selfQuery: {
		name: string;
		memberClasses: {
			name: string;
			id: string;
			assignments: Assignment[];
		}[];
		ownedClasses: {
			name: string;
			id: string;
		}[];
	};

	let classes: { name: string; id: string }[];
	$: {
		classes = ([] as { name: string; id: string }[])
			.concat(selfQuery.memberClasses, selfQuery.ownedClasses)
			.sort((a, b) => {
				return a.name.charCodeAt(0) - b.name.charCodeAt(0);
			});
	}
</script>

<section>
	<div class="classFeed hiddenWhenSmall">
		<h2><a href="/class/" class="hiddenWhenSmall"> Classes</a></h2>
		<ul>
			{#each classes as klass}
				<a href={"/class/" + klass.id}
					><li class="hiddenWhenSmall">{klass.name}</li></a
				>
			{/each}
		</ul>
	</div>
	<div class="assignmentFeed">
		{#each assignments as assignment}
			<h1>
				{assignment.name}
			</h1>

			<em>Due At</em>
			{new Date(assignment.dueAt).toDateString()}
		{/each}
	</div>
</section>

<style lang="scss">
	.classFeed {
		display: grid;
		grid-template-columns: auto;
		grid-template-rows: auto auto;
		grid-column-start: 1;
	}
	.assignmentFeed {
		grid-column-start: 2;
	}
	section {
		display: grid;
		grid-template-columns: 20% auto auto;
		grid-template-rows: auto;
	}
	ul {
		list-style: none;
		padding: unset;
	}
	a:hover {
		font-weight: 900;
	}
	@media only screen and (max-width: 600px) {
		section {
			grid-template-columns: 0 auto auto;
		}
	}
</style>
