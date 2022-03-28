<script lang="ts">
	import { onMount } from "svelte";

	export let error = {};
	export let message: string = "An unspecified error has occured";

	onMount(() => {
		console.log(error);
	});
</script>

<h1>{message}</h1>
