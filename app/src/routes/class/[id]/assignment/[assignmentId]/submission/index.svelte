<script lang="ts" context="module">
	import { load } from "$lib/functions/load/submission";
	import Check from "svelte-material-icons/Check.svelte";
	import CheckboxBlankOutline from "svelte-material-icons/CheckboxBlankOutline.svelte";
	export { load };
</script>

<script lang="ts">
	import { Viewer } from "bytemd";

	interface Submission {
		user: {
			name: string;
		};
		grade: number;
		markdownData: string;
	}
	export let submissions: Submission[];

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
</script>

<div class="wrap">
	<ul>
		{#each submissions as submission}
			<li>
				<div class="icon">
					<div>
						{#if submission.grade}
							<Check />
						{:else}
							<CheckboxBlankOutline />
						{/if}
					</div>
				</div>
				<div>
					<h3>
						{submission.user.name}
					</h3>
				</div>
			</li>
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
</div>

<style lang="scss">
	@use "../../../../../../app.scss";
	.wrap {
		display: grid;
		grid-template-columns: auto auto;
		grid-template-rows: 100%;
		height: 100%;
	}
	.preview {
		border: 0.4em app.$secondary-color solid;
		border-radius: 1em;
	}
	ul {
		border: 0.4em app.$secondary-color solid;
		border-radius: 1em;
		padding: 0;
		margin: 0;

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
	}

	h3 {
		margin: 0;
	}
	.center {
		display: grid;
		grid-template-rows: auto auto auto;
		grid-template-columns: auto auto auto;
		height: 100%;
		h1 {
			grid-row-start: 2;
			grid-column-start: 2;
			text-align: center;
			margin: 0;
			padding: 0;
			height: fit-content;
		}
	}
</style>
