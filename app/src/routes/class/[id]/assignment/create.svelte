<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { goto } from "$app/navigation";

	import { page } from "$app/stores";
	import { mutation } from "$lib/functions/query";
	import { plugins } from "$lib/markdownPlugins";

	import { Editor } from "bytemd";
	let data = { name: "", description: "" };

	function Submit() {
		mutation({
			newAssignment: [
				{
					classId: $page.params.id,
					name: data.name,
					description: data.description,
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

	function handleMarkdownChange(event) {
		data.description = event.detail.value;
	}
</script>

<h1>Create</h1>

<form>
	<label for="name">Name: </label>
	<input type="text" name="name" bind:value={data.name} />
	<label for="description">Description: </label>
	<Editor
		value={data.description}
		{plugins}
		on:change={handleMarkdownChange}
	/>
	<button type="sub3mit" on:click|preventDefault={Submit}> Create </button>
</form>
