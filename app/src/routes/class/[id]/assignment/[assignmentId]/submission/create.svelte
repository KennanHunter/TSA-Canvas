<script>
	import { goto } from "$app/navigation";

	import { page } from "$app/stores";
	import MarkdownEditor from "$lib/components/MarkdownEditor.svelte";
	import { mutation, userId } from "$lib/functions/query";
	import { toast } from "@zerodevx/svelte-toast";
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
							user: { id: true },
							assignment: {
								id: true,
							},
						},
					],
				}).then((value) => {
					goto(
						"/class/" +
							$page.params.id +
							"/assignment/" +
							$page.params.assignmentId +
							"/submission/" +
							value.submitAssignment.user.id,
					);
					toast.push("Assignment Successfully Submitted");
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
