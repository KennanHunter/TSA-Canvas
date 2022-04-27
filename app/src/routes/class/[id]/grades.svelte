<script context="module" lang="ts">
	import { page } from "$app/stores";
	import { query } from "$lib/functions/query";
	import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/internal";

	export async function load({
		params,
		fetch,
	}: LoadInput): Promise<LoadOutput<Record<string, any>>> {
		return {
			props: {
				grades: (
					await query(
						{
							Class: [
								{ classId: params.id },
								{
									assignments: {
										id: true,
										name: true,
										maxGrade: true,
										createdAt: true,
										submission: {
											grade: true,
										},
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
	interface Assignment {
		id: string;
		name: string;
		maxGrade: number;
		submission: {
			grade: number;
		};
	}

	export let grades: {
		assignments: Assignment[];
	};
</script>

<h1>Grades</h1>

<table>
	{#if grades.assignments.length > 0}
		<tr class="header">
			<td>Name</td>
			<td>Percentage</td>
			<td>Grade</td>
			<td>Max Grade</td>
		</tr>
		<hr />
	{/if}
	{#each grades.assignments as assignment}
		<tr>
			<td>
				<a
					href={"/class/" +
						$page.params.id +
						"/assignment/" +
						assignment.id}
				>
					{assignment.name}
				</a>
			</td>
			{#if assignment.submission && assignment.submission.grade}
				<td>
					{(assignment.submission.grade / assignment.maxGrade) * 100}%
				</td>
				<td>
					{assignment.submission.grade}
				</td>
			{:else}
				<td />
				<td />
			{/if}
			{#if assignment.maxGrade}
				<td>{assignment.maxGrade}</td>
			{/if}
		</tr>
	{:else}
		<h1>You don't have any assignments</h1>
	{/each}
	{#if grades.assignments.length > 0}
		<tr class="footer">
			<td>Total: </td>
			<td>
				{(() => {
					let sum = 0;
					let totalPos = 0;
					grades.assignments.forEach((assignment) => {
						if (assignment.submission) {
							sum += assignment.submission.grade;
							totalPos += assignment.maxGrade;
						}
					});
					let value = totalPos / sum;
					if (value && value !== Infinity) {
						return (value * 100).toString() + "%";
					} else {
						return "";
					}
				})()}
			</td>
			<td />
			<td />
		</tr>
	{/if}
</table>

<style lang="scss">
	table {
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
	}
	tr {
		width: 80%;
		display: flex;
		flex-direction: row;

		justify-content: space-between;
		margin-bottom: 1em;

		td {
			flex-grow: 1;
		}
	}
	.footer {
		padding-top: 0.2em;
		border-top: 0.1em solid black;
	}
</style>
