<script lang="ts">
	import { goto } from "$app/navigation";

	import { page } from "$app/stores";

	import { mutation } from "$lib/query";

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
</script>

<h1>Create</h1>

<form>
	<label for="name">Name: </label>
	<input type="text" name="name" bind:value={data.name} />
	<label for="description">Description: </label>
	<input type="text" name="description" bind:value={data.description} />
	<button type="submit" on:click|preventDefault={Submit}> Create </button>
</form>
