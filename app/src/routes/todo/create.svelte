<script lang="ts">
	import { goto } from "$app/navigation";

	import { mutation } from "$lib/functions/query";

	let data = {
		text: "",
	};
	function submit() {
		mutation({ createTodo: [{ text: data.text }, { id: true }] }).then(
			() => {
				goto("/");
			},
		);
	}
</script>

<section>
	<form on:submit|preventDefault={submit}>
		<p>Create new Todo:</p>
		<label for="text">Message: </label>
		<br />
		<input type="text" name="text" id="text" bind:value={data.text} />
		<input type="submit" value="Create" />
	</form>
</section>

<style lang="scss">
	section {
		display: grid;
		grid-template-columns: auto auto auto;
		form {
			grid-column-start: 2;
			text-align: center;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 1em;
			font-size: larger;
			input {
				width: 10em;
			}
			input[type="text"] {
				width: 100%;
			}
		}
	}
</style>
