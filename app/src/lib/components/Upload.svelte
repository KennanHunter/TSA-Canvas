<script lang="ts">
	import { goto } from "$app/navigation";
	import { mutation } from "$lib/functions/query";

	let files: FileList;

	function upload() {
		let link;
		mutation({
			uploadFile: {
				link: true,
				file: {
					id: true,
				},
			},
		}).then((value) => {
			link = value.uploadFile.link;
			console.log(link);
			fetch(link, { method: "PUT", body: files[0] }).then(() => {
				goto("/file/viewer/" + value.uploadFile.file.id);
			});
		});
	}
</script>

<div>
	<h1>Upload File</h1>
	<input type="file" name="" id="" bind:files />
	<br />
	<input type="submit" value="Upload File" on:click={upload} />
</div>
