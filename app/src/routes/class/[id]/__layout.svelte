<script>
	import { page } from "$app/stores";
</script>

<menu>
	<ul>
		<li>Class Page</li>
		<li>Grades</li>

		<li>Class Members</li>
		<li>Class Settings</li>
		<a href={"/class/" + $page.params.id + "/assignment/"}
			><li>Assignments</li></a
		>
	</ul>
</menu>
<slot />
