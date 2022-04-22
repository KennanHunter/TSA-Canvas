<script lang="ts" context="module">
	import { mutation, query } from "$lib/functions/query";
	import { plugins } from "$lib/markdownPlugins";
	import type { LoadInput, LoadOutput } from "@sveltejs/kit";

	export async function load({
		params,
		fetch,
	}: LoadInput): Promise<LoadOutput<Record<string, any>>> {
		let data = await query(
			{
				getSubmission: [
					{
						assignmentId: params.assignmentId,
						userId: params.userId,
					},
					{
						submittedAt: true,
						grade: true,
						markdownData: true,
						assignment: {
							name: true,
							maxGrade: true,
							class: {
								hasPerms: true,
							},
						},
						user: {
							id: true,
							name: true,
						},
					},
				],
			},
			fetch,
		);

		return {
			props: {
				submission: data.getSubmission,
			},
		};
	}
</script>

<script lang="ts">
	import { page } from "$app/stores";

	import { Viewer } from "bytemd";

	export let submission;

	let data: {
		grade: number; // Out of assignment.maxGrade
		comments: string;
	};

	let graded: boolean;
	$: graded =
		submission.assignment.class.hasPerms && submission.assignment.maxGrade;
</script>

<div>
	<header>
		<h1>
			{submission.assignment.name}
		</h1>
		<h2>
			<em>Submitted By</em>
			{submission.user.name}
		</h2>
	</header>
	<div class="balls">
		<div
			class="content-body wrap"
			style={graded ? "" : "grid-column: 1 / span 2"}
		>
			<Viewer value={submission.markdownData} {plugins} />
		</div>
		{#if graded}
			<div class="grade-menu wrap">
				<label for="grade">Grade</label>
				<input
					type="number"
					name="grade"
					id="grade"
					min="0"
					max={submission.assignment.maxGrade.toString()}
					bind:value={data.grade}
				/>
			</div>
			<button
				on:click={() => {
					mutation({
						gradeAssignment: [
							{
								assignmentId: $page.params.assignmentId,
								userId: $page.params.userId,
								grade: data.grade,
								comment: data.comments,
							},
							{
								grade: true,
							},
						],
					});
				}}
			>
				Submit Grade
			</button>
		{/if}
	</div>
</div>

<style lang="scss">
	@use "../../../../../../../app.scss";
	header {
		h1,
		h2 {
			display: inline-block;
			margin-right: 2em;
		}
	}

	.balls {
		display: grid;
		grid-template-columns: auto auto;
	}

	.wrap {
		border: 0.3em app.$secondary-color solid;
		padding: 1em;
		border-radius: 1em;
	}

	.content-body {
		margin-right: 1em;
	}
</style>
