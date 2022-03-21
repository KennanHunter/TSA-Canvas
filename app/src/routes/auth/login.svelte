<script lang="ts">
	import { goto } from "$app/navigation";

	import {
		authorizationHeader,
		mutation,
		setAuthorizationHeader,
	} from "$lib/query";
	import Classes from "../classes.svelte";

	interface UserRequestData {
		email?: string;
		password?: string;
		remember?: boolean;
	}

	let data: UserRequestData = {};

	function onSubmit(event) {
		mutation({
			login: [
				{ email: data.email, password: data.password },
				{ token: true },
			],
		}).then((value) => {
			setAuthorizationHeader(value.login.token, data.remember);
			goto("/");
		});
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>


<form>
	<label for="email">Email: </label>
	<input type="text" name="email" id="" bind:value={data.email} required />
	<label for="password">Password: </label>
	<input
		type="password"
		name="password"
		bind:value={data.password}
		id=""
		required
	/>
	<label for="remember">Remember Me:</label>
	<input type="checkbox" name="remember" bind:checked={data.remember} id="" />
	<input type="submit" value="Login" on:click|preventDefault={onSubmit} />
</form>

<h1>{JSON.stringify(data)}</h1>
<h1>{authorizationHeader}</h1>
