<script context="module" lang="ts">
	interface Assignment {
		name: string;
		dueAt: number;
		id: string;
		maxGrade?: number;
		class: {
			name: string;
			id: string;
		};
		submission?: {
			grade?: number;
			isSubmitted: boolean;
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
							maxGrade: true,
							id: true,
							class: {
								name: true,
								id: true,
							},
							submission: {
								grade: true,
								isSubmitted: true,
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
	import Check from "svelte-material-icons/Check.svelte";

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
			<a
				class="assignment"
				href={"/class/" +
					assignment.class.id +
					"/assignment/" +
					assignment.id}
			>
				<div>
					<h1>
						{assignment.name}
					</h1>

					<p>
						<em style="padding-right: 0.2em;">Due on</em>
						{new Date(Math.floor(assignment.dueAt)).toDateString() +
							" at " +
							new Date(
								Math.floor(assignment.dueAt),
							).toLocaleTimeString()}
					</p>
				</div>
				<a
					class="icon"
					href={"/class/" +
						assignment.class.id +
						"/assignment/" +
						assignment.id +
						"/submission/"}
				>
					<div>
						{#if assignment.submission && assignment.submission.grade}
							<p>
								{(assignment.submission.grade /
									assignment.maxGrade) *
									100}%
							</p>
						{:else if assignment.submission && assignment.submission.isSubmitted}
							<Check size="2em" />
						{:else}
							<p>Unsubmitted</p>
						{/if}
					</div>
				</a>
			</a>
		{/each}
	</div>
</section>

<style lang="scss">
	@use "../app.scss";
	.classFeed {
		h2 {
			margin-top: 0;
		}
		border: 0.4em app.$secondary-color solid;
		border-radius: 1em;
		padding: 1em;
		margin: 0em 1em 0 0.4em;
		grid-column-start: 1;
		height: 80%;
	}
	.assignmentFeed {
		grid-column-start: 2;
		display: flex;
		flex-direction: column;
		gap: 0.4em;
	}
	.assignment {
		border: 0.4em app.$secondary-color solid;
		border-radius: 1em;
		padding: 0.5em;
		padding-bottom: 1em;
		display: grid;
		grid-template-columns: 70% 30%;
		.icon {
			display: grid;
			grid-template: auto auto auto/ auto auto auto;
			div {
				grid-row-start: 2;
				grid-column-start: 2;
				text-align: center;
				display: flex;

				flex-direction: column;
				justify-content: space-between;
			}
		}
	}

	section {
		display: grid;
		grid-template-columns: 13em auto auto;
		grid-template-rows: auto;
		height: 100%;
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
