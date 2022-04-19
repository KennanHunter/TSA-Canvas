<script>
	import { goto } from "$app/navigation";

	import Upload from "$lib/components/Upload.svelte";
	import { setTitle } from "$lib/stores";

	setTitle("File Upload");
</script>

<Upload
	returnFunction={(value) => {
		// goto("file/viewer/" + value);
		goto(value);
	}}
/>
