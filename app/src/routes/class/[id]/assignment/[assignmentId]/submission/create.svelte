<script>
	import { page } from "$app/stores";

	import Upload from "$lib/components/Upload.svelte";
	import { mutation } from "$lib/functions/query";
</script>

<h1>Create Submission</h1>

<Upload
	returnFunction={(value) => {
		mutation({
			submitAssignment: [
				{
					assignmentId: $page.params.assignmentId,
					fileId: value,
				},
				{},
			],
		});
	}}
/>
