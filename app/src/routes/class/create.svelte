<script lang="ts">
	import { goto } from "$app/navigation";
	import { mutation } from "$lib/functions/query";
	import { HsvPicker } from "svelte-color-picker";

	let submissionData = { name: "", color: "" };

	const possibleRandomColors = ["#008000", "#800080", "#FF0000", "#FFFFFF"];

	function submit() {
		mutation({
			createClass: [
				{ name: submissionData.name, color: submissionData.color },
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

<section>
	<form>
		<label for="name">Class Name:</label> <br />
		<input type="text" name="name" id="" bind:value={submissionData.name} />
		<div>
			<HsvPicker
				startColor={possibleRandomColors[
					Math.round(Math.random() * possibleRandomColors.length)
				]}
			/>
		</div>
		<button type="submit" on:click|preventDefault={submit}>
			Create Class</button
		>
	</form>
</section>

<style lang="scss">
	section {
		display: grid;
		grid-template-columns: auto auto auto;
	}
	input {
		font-size: 1em;
		padding: 0.2em;
		width: 20em;
	}
	button {
		width: 20em;
	}
	div {
		align-items: center;
		width: 15em;
		margin: auto;
	}
	form {
		grid-column-start: 2;
		text-align: center;
	}
</style>
