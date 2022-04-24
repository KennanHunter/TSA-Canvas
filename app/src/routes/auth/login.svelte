<script lang="ts">
	import { goto } from "$app/navigation";

	import {
		authorizationHeader,
		mutation,
		setAuthorizationHeader,
	} from "$lib/functions/query";
	import { toast } from "@zerodevx/svelte-toast";
	import { setTitle } from "$lib/stores";

	interface UserRequestData {
		email?: string;
		password?: string;
		remember?: boolean;
	}

	setTitle("Login");

	let data: UserRequestData = { remember: true };

	function onSubmit(event) {
		mutation({
			login: [
				{ email: data.email, password: data.password },
				{
					token: true,
					user: {
						name: true,
					},
				},
			],
		}).then((value) => {
			setAuthorizationHeader(value.login.token, data.remember);
			toast.push("Logged in as " + value.login.user.name);
			goto("/");
		});
	}
</script>

<div id="outer">
	<form>
		<label for="email">Email: </label>
		<input type="text" id="email" bind:value={data.email} required />
		<label for="password">Password: </label>
		<input
			type="password"
			id="password"
			bind:value={data.password}
			required
		/>
		<div id="remember">
			<input type="checkbox" id="remember" bind:checked={data.remember} />
			<label for="remember">Remember Me:</label>
		</div>
		<input type="submit" value="Login" on:click|preventDefault={onSubmit} />
		<a href="/auth/signup"
			><input type="button" value="Sign Up Instead" /></a
		>
	</form>
</div>

<style lang="scss" src="./forms.scss"></style>
