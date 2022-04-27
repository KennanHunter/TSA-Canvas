<script lang="ts" context="module">
	import { page } from "$app/stores";
	import { load } from "$lib/functions/load/submission";
	import { mutation } from "$lib/functions/query";
	import { Viewer } from "bytemd";
	import Check from "svelte-material-icons/Check.svelte";
	import CheckboxBlankOutline from "svelte-material-icons/CheckboxBlankOutline.svelte";
	export { load };
</script>

<script lang="ts">
	import { userId } from "$lib/functions/query";

	interface Submission {
		user: {
			name: string;
			id: string;
		};
		grade: number;
		markdownData: string;
		assignment: {
			maxGrade: number;
		};
	}
	export let submissions: Submission[];
	let graded;
	$: graded = currentPreview && currentPreview.assignment.maxGrade;
	submissions.sort((a, b) => {
		if (!!a.grade === !b.grade) {
			// Case if one is completed and one is not
			return a.grade ? 100 : -100;
		} else {
			// Case if both are completed or both are uncompleted
			a.user.name.toLowerCase().charCodeAt(0) -
				b.user.name.toLowerCase().charCodeAt(0);
		}
	});

	let currentPreview: Submission;

	let grade: number;
</script>

<div class="wrap">
	<ul style={graded ? "" : "grid-row: 1/3"}>
		{#each submissions as submission}
			<li
				on:click={() => {
					if (currentPreview === submission) {
						currentPreview = null;
					} else {
						currentPreview = submission;
					}
				}}
				class={currentPreview === submission ? "active" : ""}
			>
				<div class="icon">
					<div>
						{#if submission.grade || (() => {
								if (currentPreview.user.id === submission.user.id) {
									if (currentPreview.grade) {
										submission.grade = currentPreview.grade;
										return true;
									} else {
										return false;
									}
								}
							})()}
							<Check />
							{#if submission.grade}
								{(submission.grade /
									submission.assignment.maxGrade) *
									100}%
							{/if}
						{:else}
							<CheckboxBlankOutline />
						{/if}
					</div>
				</div>
				<div class="center">
					<h3 style="grid-column-start: 1">
						{submission.user.name}
					</h3>
				</div>
			</li>
		{:else}
			<div class="center">
				<h1>There are no submissions for this assignment.</h1>
			</div>
		{/each}
	</ul>
	<div class="preview">
		{#if currentPreview}
			<Viewer value={currentPreview.markdownData} />
		{:else}
			<div class="center">
				<h1>Select Submission to preview</h1>
			</div>
		{/if}
	</div>
	<div class="gradingMenu">
		{#if graded}
			<form
				on:submit|preventDefault={() => {
					mutation({
						gradeAssignment: [
							{
								assignmentId: $page.params.assignmentId,
								userId: currentPreview.user.id,
								grade: grade,
							},
							{
								grade: true,
							},
						],
					}).then((value) => {
						currentPreview.grade = value.gradeAssignment.grade;
					});
				}}
			>
				<label for="grade">Grade Submission: </label>
				<input
					type="number"
					name="grade"
					id="grade"
					bind:value={grade}
				/>
				<p>/{currentPreview.assignment.maxGrade}</p>
				<button type="submit">Commit</button>
			</form>
		{/if}
	</div>
</div>

<style lang="scss">
	@use "../../../../../../app.scss";
	.wrap {
		display: grid;
		grid-template-columns: 20em auto;
		grid-template-rows: 70% 30%;
		height: 100%;
	}
	.preview {
		border: 0.4em app.$secondary-color solid;
		border-radius: 1em;
		padding: 1em;
		grid-row: 1/3;
		grid-column: 2/3;
	}
	.active {
		background-color: app.$primary-color;
		border-radius: 1em;
	}
	ul {
		border: 0.4em app.$secondary-color solid;
		border-radius: 1em;
		padding: 0;
		margin: 0;
		overflow: hidden scroll;
	}

	li {
		height: 5em;
		list-style: none;
		display: grid;
		grid-template-columns: 2em auto;
		grid-template-rows: auto auto;
		.icon {
			grid-column: 1;
			grid-row: 1/3;
			text-align: center;
			display: grid;
			grid-template: auto auto auto / auto auto auto;
			div {
				grid-row-start: 2;
				grid-column-start: 2;
			}
		}
	}

	h3 {
		margin: 0;
	}
	.center {
		display: grid;
		grid-template-rows: auto auto auto;
		grid-template-columns: auto auto auto;
		height: 100%;
		h1,
		h2,
		h3 {
			grid-row-start: 2;
			grid-column-start: 2;
			text-align: center;
			margin: 0;
			padding: 0;
			height: fit-content;
		}
	}
	.gradingMenu {
		form {
			input,
			p {
				display: inline-block;
			}
		}
	}
</style>
