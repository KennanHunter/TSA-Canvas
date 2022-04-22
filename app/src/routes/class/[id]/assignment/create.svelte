<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import AssignmentView from "$lib/components/AssignmentView.svelte";
	import MarkdownEditor from "$lib/components/MarkdownEditor.svelte";
	import { mutation } from "$lib/functions/query";
	import ChevronLeft from "svelte-material-icons/ChevronLeft.svelte";
	import ChevronRight from "svelte-material-icons/ChevronRight.svelte";
	import { tweened, type Tweened } from "svelte/motion";

	enum Stages {
		name,
		description,
		details,
		preview,
		create,
		sync,
	}
	let stage = Stages.name;
	let stageTweened: Tweened<number> = tweened(stage);
	let data = {
		name: "",
		description: "",
		dueAt: undefined,
		maxGrade: undefined as number,
	};
	$: console.log(data);

	$: {
		console.log("Stage: " + stage);
		stageTweened.set(stage + 1);
	}

	function Submit() {
		mutation({
			newAssignment: [
				{
					classId: $page.params.id,
					name: data.name,
					description: data.description,
					dueAt: data.dueAt,
					maxGrade: data.maxGrade,
				},
				{ id: true },
			],
		}).then((value) => {
			goto(
				"/class/" +
					$page.params.id +
					"/assignment/" +
					value.newAssignment.id +
					"/",
			);
		});
	}
</script>

<h1>Create Assignment</h1>
<progress value={$stageTweened / 6} />
<nav>
	<button
		on:click|preventDefault={() => {
			stage -= 1;
		}}
	>
		<ChevronLeft />
		Back
	</button>
	<button
		on:click|preventDefault={() => {
			stage += 1;
		}}
	>
		<ChevronRight />
		Foward
	</button>
</nav>

<form
	on:keydown={(e) => {
		if (e.keyCode === 13) {
			e.preventDefault();
			e.stopImmediatePropagation();

			// Essentially the foward button
			// Prevent from interfering with description textbox
			if (stage !== 1) {
				stage += 1;
			}
		}
	}}
>
	{#if stage === Stages.name}
		<div class="stage">
			<label for="name">Assignment Name: </label>
			<br />
			<input type="text" name="name" bind:value={data.name} />
			<p>
				Note: Good Assignment Names are simple and to the point, more
				information can go into the Description
			</p>
		</div>
	{/if}

	{#if stage === Stages.description}
		<div class="stage">
			<label for="description">Description: </label>
			<MarkdownEditor bind:value={data.description} />
		</div>
	{/if}

	{#if stage === Stages.details}
		<div class="stage">
			<h1>Details</h1>
			<label for="due">Due Date</label>
			<input id="due" type="datetime-local" bind:value={data.dueAt} />
			<label for="maxGrade">Max Grade</label>
			<input
				type="number"
				min="0"
				id="maxGrade"
				bind:value={data.maxGrade}
			/>
		</div>
	{/if}
	{#if stage === Stages.preview}
		<div class="stage">
			<h1>Preview</h1>
			<div class="preview">
				<AssignmentView assignment={data} />
			</div>
		</div>
	{/if}

	{#if stage === Stages.create}
		<button type="submit" on:click|preventDefault={Submit}> Create </button>
	{/if}

	{#if stage === Stages.sync}
		<h1>TODO: Sync</h1>
	{/if}
</form>

<style lang="scss">
	@use "../../../../app.scss";
	nav {
		display: inline-block;
	}
	progress {
		width: 80%;
		display: inline-block;
		height: 1em;
	}

	::-moz-progress-bar {
		background-color: app.$secondary-color;
	}

	label {
		font-size: 2em;
	}
	input {
		width: 30em;
	}
	form {
		margin-top: 0.3em;
	}

	p {
		width: 30em;
	}
	button {
		display: inline-flex;
		align-items: center;
	}
	.preview {
		padding: 1em;
		border: 0.3em solid app.$secondary-color;
		border-radius: 1em;
	}
</style>
