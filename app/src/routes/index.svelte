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
			assignments: Assignment[];
		}[];
	};
</script>

<section>
	{selfQuery.name}
	{#each assignments as assignment}
		<h1>
			{assignment.name}
		</h1>

		<em>Due At</em>
		{new Date(assignment.dueAt).toDateString()}
	{/each}
</section>

<style>
</style>
