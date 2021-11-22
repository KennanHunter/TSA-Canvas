<ul>
	<li id="Title" />
	<li class="hoverable"><a href="/#/assignment/">Assignments</a></li>
	<li class="hoverable"><a href="/#/">foo</a></li>
	<li id="github" class="hoverable">
		<a href="https://github.com/KennanHunter/TSA-canvas">GitHub</a>
	</li>
</ul>

<style>
	#Title {
		justify-self: flex-start;
	}

	/* The navbar container */
	ul {
		overflow: hidden;
		background-color: #333;
		margin: 0;
		z-index: 11;
		font-family: "Fira Code", monospace;
	}

	/* Navbar links */
	li {
		float: left;
		display: block;
		color: #f2f2f2;
		text-align: center;
		padding: 12px 16px;
		text-decoration: none;
	}
	a {
		color: #f2f2f2;
		padding: 0;
	}

	/* Links - change color on hover */
	.hoverable:hover {
		background-color: #ddd;
		color: black;
	}
</style>
