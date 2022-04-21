<script>
	import { toast } from "@zerodevx/svelte-toast";
</script>

<button
	on:click={() => {
		toast.push("Test Notification");
	}}>Send notification</button
>
