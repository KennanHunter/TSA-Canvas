<script>
	import { page } from "$app/stores";
</script>

<div>
	<menu>
		<ul>
			<a href={"/class/" + $page.params.id}><li>Class Page</li></a>
			<a href={"/class/" + $page.params.id + "/grades/"}
				><li>Grades</li></a
			>

			<a href={"/class/" + $page.params.id + "/members/"}
				><li>Class Members</li></a
			>
			<a href={"/class/" + $page.params.id + "/settings/"}
				><li>Settings</li></a
			>
		</ul>
	</menu>
	<slot />
</div>

<style>
	div {
		display: grid;
		grid-template-columns: 10% auto;
	}
</style>
