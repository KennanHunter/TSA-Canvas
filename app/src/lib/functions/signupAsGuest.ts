import { goto } from "$app/navigation";
import { mutation, setAuthorizationHeader } from "../functions/query";

export async function signupAsGuest() {
	const { email } = (
		await mutation({
			signUpGuest: {
				email: true,
			},
		})
	).signUpGuest;

	setAuthorizationHeader(
		(
			await mutation({
				login: [
					{
						email: email,
						password: "GuestPassword",
					},
					{ token: true },
				],
			})
		).login.token,
		true,
	);

	goto("/");
}
