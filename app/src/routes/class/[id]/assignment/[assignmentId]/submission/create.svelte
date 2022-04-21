<script>
	import { page } from "$app/stores";
	import MarkdownEditor from "$lib/components/MarkdownEditor.svelte";
	import { mutation } from "$lib/functions/query";
	import { Editor } from "bytemd";

	let value;
</script>

<div class="fuck">
	<div class="bar">
		<h1>Create Submission</h1>

		<button
			on:click={() => {
				mutation({
					submitAssignment: [
						{
							assignmentId: $page.params.assignmentId,
							value: value,
						},
						{
							assignment: {
								id: true,
							},
						},
					],
				});
			}}
		>
			Submit Assignment</button
		>
	</div>
	<MarkdownEditor bind:value />
</div>

<style>
	.bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.fuck {
		display: flex;
		flex-direction: column;
		height: 100%;
		margin-right: 1em;
	}
</style>
