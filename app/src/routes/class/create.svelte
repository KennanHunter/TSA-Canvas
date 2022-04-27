<script lang="ts">
	import { goto } from "$app/navigation";
	import MarkdownEditor from "$lib/components/MarkdownEditor.svelte";
	import { mutation } from "$lib/functions/query";
	import ChevronLeft from "svelte-material-icons/ChevronLeft.svelte";
	import ChevronRight from "svelte-material-icons/ChevronRight.svelte";
	import { tweened, type Tweened } from "svelte/motion";
	import Settings from "./[id]/settings.svelte";

	enum Stages {
		name,
		description,
		// details,
		create,
	}
	let stage = Stages.name;
	let stageTweened: Tweened<number> = tweened(stage);
	let submissionData = {
		name: "",
		description: "",
	};

	$: {
		console.log("Stage: " + stage);
		stageTweened.set(stage + 1);
	}
	function submit() {
		mutation({
			createClass: [
				{
					name: submissionData.name,
					color: "",
					description: submissionData.description,
				},
				{
					id: true,
				},
			],
		}).then((value) => {
			goto("/class/" + value.createClass.id);
		});
	}
</script>

<h1>Create class</h1>
<progress value={$stageTweened / 3} />
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

<section>
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
			<div class="name">
				<label for="name">Class Name:</label> <br />
				<input
					type="text"
					name="name"
					id=""
					bind:value={submissionData.name}
				/>
			</div>
		{/if}

		{#if stage === Stages.description}
			<div class="description">
				<MarkdownEditor bind:value={submissionData.description} />
			</div>
		{/if}

		{#if stage === Stages.create}
			<button type="submit" on:click|preventDefault={submit}>
				Create Class</button
			>
		{/if}
	</form>
</section>

<style lang="scss">
	@use "../../app.scss";
	nav {
		display: inline-block;
	}
	progress {
		width: 80%;
		display: inline-block;
		height: 1em;
	}
</style>
