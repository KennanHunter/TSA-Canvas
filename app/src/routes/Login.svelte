<script lang="ts">
	import { onMount } from "svelte";
	import { prevent_default } from "svelte/internal";

	let data = {
		firstName: "John",
		lastName: "Doe",
	};
	let response;
	function login() {
		fetch("/api/users", {
			method: "POST",
			body: JSON.stringify(data),
		}).then((value) => {
			response = value;
			console.log(response);
		});
	}
</script>

{#if response !== undefined}
	<h1>{response || "No Data Yet"}</h1>
{/if}

<form on:submit|preventDefault={login}>
	<label for="firstname">First name:</label>
	<input type="text" id="firstname" bind:value={data.firstName} />
	<label for="lastname">Last name:</label>
	<input type="text" id="lastname" bind:value={data.lastName} />
	<input type="submit" />
</form>
