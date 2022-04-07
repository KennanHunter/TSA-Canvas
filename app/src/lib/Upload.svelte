<script>
	import { goto } from "$app/navigation";

	import { mutation } from "./query";

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
			goto("/file/viewer/" + value.uploadFile.file.id);
		});
	}
</script>

<div>
	<h1>Upload File</h1>
	<input type="file" name="" id="" />
	<br />
	<input type="submit" value="Upload File" on:click={upload} />
</div>
