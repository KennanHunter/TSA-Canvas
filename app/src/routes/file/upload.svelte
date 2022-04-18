<script>
	import { goto } from "$app/navigation";

	import Upload from "$lib/components/Upload.svelte";
</script>

<Upload
	returnFunction={(value) => {
		// goto("file/viewer/" + value);
		goto(value);
	}}
/>
