import { goto } from "$app/navigation";
import { setAuthorizationHeader } from "./query";

export function logout() {
	setAuthorizationHeader("", true);
	goto("/auth/login");
}
