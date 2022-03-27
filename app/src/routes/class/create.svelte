<script lang="ts">
	import { goto } from "$app/navigation";
	import { mutation } from "$lib/query";
	import { HsvPicker } from "svelte-color-picker";

	let submissionData = { name: "", color: "" };

	const possibleRandomColors = ["#008000", "#800080", "#FF0000", "#FFFFFF"];

	function submit() {
		mutation({
			create: [
				{ name: submissionData.name, color: submissionData.color },
				{
					id: true,
				},
			],
		}).then((value) => {
			goto("/class/" + value.create.id);
		});
	}
</script>

<h1>Create class</h1>

<form>
	<label for="name">Class Name:</label>
	<input type="text" name="name" id="" bind:value={submissionData.name} />
	<HsvPicker
		startColor={possibleRandomColors[
			Math.round(Math.random() * possibleRandomColors.length)
		]}
	/>
	<button type="submit" on:click|preventDefault={submit}>
		Create Class</button
	>
</form>
