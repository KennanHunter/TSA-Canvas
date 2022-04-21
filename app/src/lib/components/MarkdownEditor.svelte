<script>
	import { plugins } from "$lib/markdownPlugins";
	import { Editor } from "bytemd";

	export let value = "";

	function handleMarkdownChange(event) {
		value = event.detail.value;
	}
</script>

<Editor {value} {plugins} on:change={handleMarkdownChange} />

<style>
</style>
